import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
import { AddToWishlistDto } from './dto';
import { WishlistService } from './wishlist.service';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserWishlist(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.wishlistService.getUserWishlist(req.user.id, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiResponse({
    status: 201,
    description: 'Product added to wishlist successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addToWishlist(
    @Request() req,
    @Body() addToWishlistDto: AddToWishlistDto,
  ) {
    return this.wishlistService.addToWishlist(req.user.id, addToWishlistDto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product removed from wishlist successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found in wishlist' })
  async removeFromWishlist(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(req.user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist cleared successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async clearWishlist(@Request() req) {
    return this.wishlistService.clearWishlist(req.user.id);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get wishlist item count' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist count retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWishlistCount(@Request() req) {
    const count = await this.wishlistService.getWishlistCount(req.user.id);
    return { count };
  }

  @Post(':productId/move-to-cart')
  @ApiOperation({ summary: 'Move product from wishlist to cart' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product moved to cart successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found in wishlist' })
  async moveToCart(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.moveToCart(req.user.id, productId);
  }

  @Get(':productId/check')
  @ApiOperation({ summary: 'Check if product is in wishlist' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist status checked successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkWishlistStatus(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    const isInWishlist = await this.wishlistService.isInWishlist(
      req.user.id,
      productId,
    );
    return { isInWishlist };
  }
}
