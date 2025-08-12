import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (admin/vendor only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only vendors and admins can create products.' })
  create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    const userId = req.user.id;
    const isVendor = req.user.isVendor;
    const isAdmin = req.user.isAdmin;
    
    if (!isVendor && !isAdmin) {
      throw new Error('Only vendors and admins can create products');
    }
    
    return this.productsService.createProduct(createProductDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
  findAll(@Query() query: any) {
    return this.productsService.findAllProducts(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully.' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, description: 'Products by category retrieved successfully.' })
  getProductsByCategory(@Param('categoryId') categoryId: string, @Query() query: any) {
    return this.productsService.getProductsByCategory(categoryId, query);
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get available filters for products' })
  @ApiResponse({ status: 200, description: 'Filters retrieved successfully.' })
  getAvailableFilters() {
    return this.productsService.getAvailableFilters();
  }

  @Post('filter')
  @ApiOperation({ summary: 'Filter products with custom criteria' })
  @ApiResponse({ status: 200, description: 'Filtered products retrieved successfully.' })
  filterProducts(@Body() filters: any) {
    return this.productsService.findAllProducts(filters);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully.' })
  searchProducts(@Query('q') query: string, @Query() filters: any) {
    if (!query) {
      return { products: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
    return this.productsService.searchProducts(query, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findProductById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (admin/vendor only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - You can only update your own products.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    return this.productsService.updateProduct(id, updateProductDto, userId, isAdmin);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (admin/vendor only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - You can only delete your own products.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    return this.productsService.deleteProduct(id, userId, isAdmin);
  }
}

@ApiTags('Vendor')
@Controller('vendor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get vendor products' })
  @ApiResponse({ status: 200, description: 'Vendor products retrieved successfully.' })
  getVendorProducts(@Req() req: any) {
    const userId = req.user.id;
    if (!req.user.isVendor && !req.user.isAdmin) {
      throw new Error('Only vendors can access this endpoint');
    }
    return this.productsService.getVendorProducts(userId);
  }
} 