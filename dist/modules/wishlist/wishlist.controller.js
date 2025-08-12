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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../core/guards/jwt.auth.guard");
const wishlist_service_1 = require("./wishlist.service");
const dto_1 = require("./dto");
let WishlistController = class WishlistController {
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    async getUserWishlist(req, page, limit) {
        return this.wishlistService.getUserWishlist(req.user.id, page, limit);
    }
    async addToWishlist(req, addToWishlistDto) {
        return this.wishlistService.addToWishlist(req.user.id, addToWishlistDto);
    }
    async removeFromWishlist(req, productId) {
        return this.wishlistService.removeFromWishlist(req.user.id, productId);
    }
    async clearWishlist(req) {
        return this.wishlistService.clearWishlist(req.user.id);
    }
    async getWishlistCount(req) {
        const count = await this.wishlistService.getWishlistCount(req.user.id);
        return { count };
    }
    async moveToCart(req, productId) {
        return this.wishlistService.moveToCart(req.user.id, productId);
    }
    async checkWishlistStatus(req, productId) {
        const isInWishlist = await this.wishlistService.isInWishlist(req.user.id, productId);
        return { isInWishlist };
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user wishlist' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Wishlist retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getUserWishlist", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add product to wishlist' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Product added to wishlist successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddToWishlistDto]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "addToWishlist", null);
__decorate([
    (0, common_1.Delete)(':productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove product from wishlist' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product removed from wishlist successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found in wishlist' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "removeFromWishlist", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Clear wishlist' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Wishlist cleared successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "clearWishlist", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wishlist item count' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Wishlist count retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getWishlistCount", null);
__decorate([
    (0, common_1.Post)(':productId/move-to-cart'),
    (0, swagger_1.ApiOperation)({ summary: 'Move product from wishlist to cart' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product moved to cart successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found in wishlist' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "moveToCart", null);
__decorate([
    (0, common_1.Get)(':productId/check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if product is in wishlist' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Wishlist status checked successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "checkWishlistStatus", null);
exports.WishlistController = WishlistController = __decorate([
    (0, swagger_1.ApiTags)('Wishlist'),
    (0, common_1.Controller)('wishlist'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map