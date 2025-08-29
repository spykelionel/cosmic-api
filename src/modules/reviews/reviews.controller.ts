import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('products/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add review to product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 201,
    description: 'Review added successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async createReview(
    @Request() req,
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(
      req.user.id,
      productId,
      createReviewDto,
    );
  }

  @Get('products/:productId')
  @ApiOperation({ summary: 'Get product reviews' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Product reviews retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.reviewsService.getProductReviews(productId, page, limit);
  }

  @Put(':reviewId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update review' })
  @ApiParam({ name: 'reviewId', description: 'Review ID' })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async updateReview(
    @Request() req,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(
      req.user.id,
      reviewId,
      updateReviewDto,
    );
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete review' })
  @ApiParam({ name: 'reviewId', description: 'Review ID' })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async deleteReview(@Request() req, @Param('reviewId') reviewId: string) {
    return this.reviewsService.deleteReview(req.user.id, reviewId);
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user reviews' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'User reviews retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserReviews(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('page', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.reviewsService.getUserReviews(req.user.id, page, limit);
  }

  @Get('vendor/products')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get vendor product reviews' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Vendor product reviews retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getVendorProductReviews(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.reviewsService.getVendorProductReviews(
      req.user.id,
      page,
      limit,
    );
  }
}

// Alternative route for product reviews (as mentioned in requirements)
@ApiTags('Products')
@Controller('products')
export class ProductReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add review to product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 201,
    description: 'Review added successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async createProductReview(
    @Request() req,
    @Param('id') productId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(
      req.user.id,
      productId,
      createReviewDto,
    );
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get product reviews' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Product reviews retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductReviews(
    @Param('id') productId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.reviewsService.getProductReviews(productId, page, limit);
  }
}
