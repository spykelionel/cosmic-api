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
exports.ProductReviewsController = exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../core/guards/jwt.auth.guard");
const reviews_service_1 = require("./reviews.service");
const dto_1 = require("./dto");
let ReviewsController = class ReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async createReview(req, productId, createReviewDto) {
        return this.reviewsService.createReview(req.user.id, productId, createReviewDto);
    }
    async getProductReviews(productId, page, limit) {
        return this.reviewsService.getProductReviews(productId, page, limit);
    }
    async updateReview(req, reviewId, updateReviewDto) {
        return this.reviewsService.updateReview(req.user.id, reviewId, updateReviewDto);
    }
    async deleteReview(req, reviewId) {
        return this.reviewsService.deleteReview(req.user.id, reviewId);
    }
    async getUserReviews(req, page, limit) {
        return this.reviewsService.getUserReviews(req.user.id, page, limit);
    }
    async getVendorProductReviews(req, page, limit) {
        return this.reviewsService.getVendorProductReviews(req.user.id, page, limit);
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Post)('products/:productId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add review to product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Review added successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('products/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product reviews' }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'Product ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product reviews retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getProductReviews", null);
__decorate([
    (0, common_1.Put)(':reviewId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update review' }),
    (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Review updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('reviewId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "updateReview", null);
__decorate([
    (0, common_1.Delete)(':reviewId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete review' }),
    (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Review deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('reviewId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Get)('user/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user reviews' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User reviews retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getUserReviews", null);
__decorate([
    (0, common_1.Get)('vendor/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor product reviews' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Vendor product reviews retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getVendorProductReviews", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Reviews'),
    (0, common_1.Controller)('reviews'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
let ProductReviewsController = class ProductReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async createProductReview(req, productId, createReviewDto) {
        return this.reviewsService.createReview(req.user.id, productId, createReviewDto);
    }
    async getProductReviews(productId, page, limit) {
        return this.reviewsService.getProductReviews(productId, page, limit);
    }
};
exports.ProductReviewsController = ProductReviewsController;
__decorate([
    (0, common_1.Post)(':id/reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add review to product' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Review added successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ProductReviewsController.prototype, "createProductReview", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product reviews' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product reviews retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductReviewsController.prototype, "getProductReviews", null);
exports.ProductReviewsController = ProductReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ProductReviewsController);
//# sourceMappingURL=reviews.controller.js.map