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
exports.VendorProductsController = exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../core/guards/jwt.auth.guard");
const products_service_1 = require("./products.service");
const dto_1 = require("./dto");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    create(createProductDto, req) {
        const userId = req.user.id;
        const isVendor = req.user.isVendor;
        const isAdmin = req.user.isAdmin;
        if (!isVendor && !isAdmin) {
            throw new Error('Only vendors and admins can create products');
        }
        return this.productsService.createProduct(createProductDto, userId);
    }
    findAll(query) {
        return this.productsService.findAllProducts(query);
    }
    getCategories() {
        return this.productsService.getCategories();
    }
    getProductsByCategory(categoryId, query) {
        return this.productsService.getProductsByCategory(categoryId, query);
    }
    getAvailableFilters() {
        return this.productsService.getAvailableFilters();
    }
    filterProducts(filters) {
        return this.productsService.findAllProducts(filters);
    }
    searchProducts(query, filters) {
        if (!query) {
            return { products: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
        }
        return this.productsService.searchProducts(query, filters);
    }
    findOne(id) {
        return this.productsService.findProductById(id);
    }
    update(id, updateProductDto, req) {
        const userId = req.user.id;
        const isAdmin = req.user.isAdmin;
        return this.productsService.updateProduct(id, updateProductDto, userId, isAdmin);
    }
    remove(id, req) {
        const userId = req.user.id;
        const isAdmin = req.user.isAdmin;
        return this.productsService.deleteProduct(id, userId, isAdmin);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product (admin/vendor only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only vendors and admins can create products.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products retrieved successfully.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all product categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories retrieved successfully.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get products by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products by category retrieved successfully.' }),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductsByCategory", null);
__decorate([
    (0, common_1.Get)('filters'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available filters for products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Filters retrieved successfully.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getAvailableFilters", null);
__decorate([
    (0, common_1.Post)('filter'),
    (0, swagger_1.ApiOperation)({ summary: 'Filter products with custom criteria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Filtered products retrieved successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "filterProducts", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search results retrieved successfully.' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single product by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a product (admin/vendor only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - You can only update your own products.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a product (admin/vendor only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - You can only delete your own products.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
let VendorProductsController = class VendorProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    getVendorProducts(req) {
        const userId = req.user.id;
        if (!req.user.isVendor && !req.user.isAdmin) {
            throw new Error('Only vendors can access this endpoint');
        }
        return this.productsService.getVendorProducts(userId);
    }
};
exports.VendorProductsController = VendorProductsController;
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor products retrieved successfully.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorProductsController.prototype, "getVendorProducts", null);
exports.VendorProductsController = VendorProductsController = __decorate([
    (0, swagger_1.ApiTags)('Vendor'),
    (0, common_1.Controller)('vendor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], VendorProductsController);
//# sourceMappingURL=products.controller.js.map