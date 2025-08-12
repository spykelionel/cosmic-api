import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully.' })
  getCart(@Req() req: any) {
    const userId = req.user.id;
    return this.cartService.getCart(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or insufficient stock.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  addToCart(@Body() addToCartDto: AddToCartDto, @Req() req: any) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid quantity or insufficient stock.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  updateCartItem(
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.cartService.updateCartItem(userId, itemId, updateCartItemDto);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  removeFromCart(@Param('itemId') itemId: string, @Req() req: any) {
    const userId = req.user.id;
    return this.cartService.removeFromCart(userId, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully.' })
  clearCart(@Req() req: any) {
    const userId = req.user.id;
    return this.cartService.clearCart(userId);
  }
} 