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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../core/guards/jwt.auth.guard");
const cart_service_1 = require("./cart.service");
const dto_1 = require("./dto");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    getCart(req) {
        const userId = req.user.id;
        return this.cartService.getCart(userId);
    }
    addToCart(addToCartDto, req) {
        const userId = req.user.id;
        return this.cartService.addToCart(userId, addToCartDto);
    }
    updateCartItem(itemId, updateCartItemDto, req) {
        const userId = req.user.id;
        return this.cartService.updateCartItem(userId, itemId, updateCartItemDto);
    }
    removeFromCart(itemId, req) {
        const userId = req.user.id;
        return this.cartService.removeFromCart(userId, itemId);
    }
    clearCart(req) {
        const userId = req.user.id;
        return this.cartService.clearCart(userId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart retrieved successfully.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item added to cart successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid data or insufficient stock.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AddToCartDto, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Patch)(':itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cart item quantity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart item updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid quantity or insufficient stock.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart item not found.' }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCartItemDto, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Delete)(':itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removed from cart successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cart item not found.' }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeFromCart", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Clear entire cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart cleared successfully.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('cart'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map