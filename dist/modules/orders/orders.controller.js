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
exports.VendorOrdersController = exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../core/guards/jwt.auth.guard");
const orders_service_1 = require("./orders.service");
const dto_1 = require("./dto");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    createOrder(createOrderDto, req) {
        const userId = req.user.id;
        return this.ordersService.createOrder(userId, createOrderDto);
    }
    getUserOrders(query, req) {
        const userId = req.user.id;
        return this.ordersService.findUserOrders(userId, query);
    }
    getOrderById(orderId, req) {
        const userId = req.user.id;
        return this.ordersService.findOrderById(orderId, userId);
    }
    cancelOrder(orderId, req) {
        const userId = req.user.id;
        return this.ordersService.cancelOrder(orderId, userId);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order from cart' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Cart empty or insufficient stock.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user order history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully.' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Get)(':orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order details retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found.' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Patch)(':orderId/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order cancelled successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Order cannot be cancelled at this stage.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found.' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "cancelOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
let VendorOrdersController = class VendorOrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    getVendorOrders(query, req) {
        const userId = req.user.id;
        if (!req.user.isVendor && !req.user.isAdmin) {
            throw new Error('Only vendors can access this endpoint');
        }
        return this.ordersService.getVendorOrders(userId, query);
    }
    updateOrderStatus(orderId, updateOrderStatusDto, req) {
        const userId = req.user.id;
        if (!req.user.isVendor && !req.user.isAdmin) {
            throw new Error('Only vendors can update order status');
        }
        return this.ordersService.updateOrderStatus(orderId, userId, updateOrderStatusDto);
    }
    getVendorStats(req) {
        const userId = req.user.id;
        if (!req.user.isVendor && !req.user.isAdmin) {
            throw new Error('Only vendors can access this endpoint');
        }
        return this.ordersService.getVendorStats(userId);
    }
};
exports.VendorOrdersController = VendorOrdersController;
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor orders retrieved successfully.' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VendorOrdersController.prototype, "getVendorOrders", null);
__decorate([
    (0, common_1.Patch)('orders/:orderId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status (vendor only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order status updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found or unauthorized.' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateOrderStatusDto, Object]),
    __metadata("design:returntype", void 0)
], VendorOrdersController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor stats retrieved successfully.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorOrdersController.prototype, "getVendorStats", null);
exports.VendorOrdersController = VendorOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Vendor'),
    (0, common_1.Controller)('vendor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], VendorOrdersController);
//# sourceMappingURL=orders.controller.js.map