import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order from cart' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Cart empty or insufficient stock.' })
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const userId = req.user.id;
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user order history' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully.' })
  getUserOrders(@Query() query: any, @Req() req: any) {
    const userId = req.user.id;
    return this.ordersService.findUserOrders(userId, query);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiResponse({ status: 200, description: 'Order details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  getOrderById(@Param('orderId') orderId: string, @Req() req: any) {
    const userId = req.user.id;
    return this.ordersService.findOrderById(orderId, userId);
  }

  @Patch(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully.' })
  @ApiResponse({ status: 400, description: 'Order cannot be cancelled at this stage.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  cancelOrder(@Param('orderId') orderId: string, @Req() req: any) {
    const userId = req.user.id;
    return this.ordersService.cancelOrder(orderId, userId);
  }
}

@ApiTags('Vendor')
@Controller('vendor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('orders')
  @ApiOperation({ summary: 'Get vendor orders' })
  @ApiResponse({ status: 200, description: 'Vendor orders retrieved successfully.' })
  getVendorOrders(@Query() query: any, @Req() req: any) {
    const userId = req.user.id;
    if (!req.user.isVendor && !req.user.isAdmin) {
      throw new Error('Only vendors can access this endpoint');
    }
    return this.ordersService.getVendorOrders(userId, query);
  }

  @Patch('orders/:orderId/status')
  @ApiOperation({ summary: 'Update order status (vendor only)' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found or unauthorized.' })
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    if (!req.user.isVendor && !req.user.isAdmin) {
      throw new Error('Only vendors can update order status');
    }
    return this.ordersService.updateOrderStatus(orderId, userId, updateOrderStatusDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get vendor dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Vendor stats retrieved successfully.' })
  getVendorStats(@Req() req: any) {
    const userId = req.user.id;
    if (!req.user.isVendor && !req.user.isAdmin) {
      throw new Error('Only vendors can access this endpoint');
    }
    return this.ordersService.getVendorStats(userId);
  }
} 