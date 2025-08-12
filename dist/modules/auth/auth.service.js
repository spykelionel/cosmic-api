"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const argon2_1 = require("argon2");
const utility_service_1 = require("../../core/services/utility.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async register(userData) {
        const passwordHash = await (0, argon2_1.hash)(userData.password);
        const findUser = await this.prisma.user.findUnique({
            where: { email: userData.email },
        });
        console.log(findUser);
        if (findUser) {
            throw new common_1.ForbiddenException('Email already registered, try login in.');
        }
        if (userData.name.length > 20) {
            throw new common_1.ForbiddenException('Name can not be more than 20 characters');
        }
        try {
            let user = await this.prisma.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    password: passwordHash,
                    isAdmin: false,
                },
            });
            console.log('Creating ', user);
            delete user.password;
            delete user.isAdmin;
            delete user.refreshToken;
            const login = await this.login({
                email: userData.email,
                password: userData.password,
            });
            user = { ...user, ...login };
            return user;
        }
        catch (error) {
            console.log(error);
            (0, utility_service_1.httpErrorException)(error);
        }
    }
    generateRandomPassword(length) {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const specialChars = '!@#$%^&*()-=_+[]{}|;:,.<>?';
        const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            password += allChars.charAt(randomIndex);
        }
        return password;
    }
    async generateTokens(user) {
        delete user.password;
        delete user.isAdmin;
        delete user.updatedAt;
        delete user.refreshToken;
        const signToken = await this.jwt.signAsync(user, {
            expiresIn: '24h',
            secret: this.config.get('JWT_SECRET'),
        });
        const refreshToken = await this.jwt.signAsync(user, {
            expiresIn: '2days',
            secret: this.config.get('JWT_RefreshSecret'),
        });
        return {
            access_token: signToken,
            refresh_token: refreshToken,
        };
    }
    async login(loginData, passwordlessLogin) {
        let user;
        try {
            user = await this.prisma.user.findUnique({
                where: { email: loginData.email },
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user?.isAdmin === true) {
            throw new common_1.ForbiddenException('You are not allowed to login here');
        }
        let isFavorite = false;
        if (user) {
            const password = await (0, argon2_1.verify)(user?.password, loginData.password);
            if (password || passwordlessLogin) {
                isFavorite =
                    Array.isArray(user?.itFavorite) && user?.itFavorite.length > 0;
                const tokens = await this.generateTokens(user);
                await this.updateRefreshToken(user?.id, tokens.refresh_token);
                return {
                    ...tokens,
                    isFavorite,
                    userName: user?.name,
                    userId: user?.id,
                };
            }
            else {
                throw new common_1.ForbiddenException('Incorrect Password');
            }
        }
        else {
            throw new common_1.ForbiddenException('User Not found');
        }
    }
    async updateRefreshToken(userId, refreshToken) {
        const refreshTokenHash = await (0, argon2_1.hash)(refreshToken);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: refreshTokenHash,
            },
        });
    }
    async refreshToken(refreshToken) {
        let userDetails;
        try {
            userDetails = await this.jwt.verifyAsync(refreshToken, {
                secret: process.env.JWT_RefreshSecret,
            });
        }
        catch {
            (0, utility_service_1.httpErrorException)('Your login session has timed out. Login again');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: userDetails.id,
            },
        });
        if (!user.refreshToken)
            throw new common_1.ForbiddenException('Access Denied');
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }
    async adminLogin(loginData) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginData.email },
        });
        if (!user) {
            throw new common_1.ForbiddenException('User Not found or not an admin');
        }
        if (user.isAdmin === true) {
            const password = await (0, argon2_1.verify)(user.password, loginData.password);
            if (password) {
                delete user.password;
                const signToken = await this.jwt.signAsync(user, {
                    expiresIn: '2h',
                    secret: this.config.get('JWT_SECRET'),
                });
                return {
                    access_token: signToken,
                };
            }
            else {
                throw new common_1.ForbiddenException('Incorrect Password');
            }
        }
        else {
            throw new common_1.ForbiddenException('User Not found or not an admin');
        }
    }
    async registerAdmin(userData) {
        userData['isAdmin'] = true;
        let res;
        await this.register(userData).then((r) => {
            res = r;
        });
        return res;
    }
    async resetPassword(email, newPassword, refreshToken) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.ForbiddenException('User not found');
        }
        const checkRefreshToken = await (0, argon2_1.verify)(user.refreshToken, refreshToken);
        if (!checkRefreshToken)
            throw new common_1.ForbiddenException('Access Denied');
        const newPasswordHash = await (0, argon2_1.hash)(newPassword);
        await this.prisma.user.update({
            where: {
                email,
            },
            data: {
                password: newPasswordHash,
            },
        });
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }
    async getUserIdFromToken(token) {
        try {
            const decodedToken = this.jwtService.verify(token);
            return decodedToken.sub;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async updateUserProfile(user, userId) {
        const existingUser = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        if (!existingUser) {
            return {
                message: 'No user with such Id found',
                data: {},
                statusCode: 404,
            };
        }
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    ...user,
                },
            });
            return updatedUser;
        }
        catch (error) {
            return (0, utility_service_1.httpErrorException)(error);
        }
    }
    async getAllUsers() {
        const users = await this.prisma.user.findMany();
        return users;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map