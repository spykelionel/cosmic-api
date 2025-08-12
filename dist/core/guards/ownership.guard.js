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
exports.OwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma/prisma.service");
let OwnershipGuard = class OwnershipGuard {
    constructor(prisma, reflector) {
        this.prisma = prisma;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const resourceId = request.params.id;
        const resourceType = this.reflector.get('resourceType', context.getHandler());
        if (!resourceType) {
            return true;
        }
        let resource;
        switch (resourceType) {
            case 'user':
                resource = await this.prisma.user.findUnique({
                    where: { id: resourceId },
                });
                if (!resource && user?.isAdmin) {
                    resource = true;
                }
                break;
            case 'channel':
                resource = await this.prisma.channel.findUnique({
                    where: { id: resourceId },
                });
                break;
            case 'lesson':
                resource = await this.prisma.lesson.findUnique({
                    where: { id: resourceId },
                });
                break;
            case 'quiz':
                resource = await this.prisma.quiz.findUnique({
                    where: { id: resourceId },
                });
                break;
            default:
                throw new common_1.ForbiddenException('Unknown resource type');
        }
        if (!resource) {
            throw new common_1.ForbiddenException("Resource doesn't exist or You do not have permission to modify this resource");
        }
        return true;
    }
};
exports.OwnershipGuard = OwnershipGuard;
exports.OwnershipGuard = OwnershipGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        core_1.Reflector])
], OwnershipGuard);
//# sourceMappingURL=ownership.guard.js.map