import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AdminOrVendor,
  ModerateRateLimit,
  OwnProduct,
  SearchRateLimit,
} from '../../core/decorators';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { OwnershipGuard } from '../../core/guards/ownership.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ModerateRateLimit()
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieve all products with filtering, sorting, and pagination',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Category filter',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Minimum price filter',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Maximum price filter',
  })
  @ApiQuery({
    name: 'rating',
    required: false,
    description: 'Minimum rating filter',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort field (price, rating, date)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc, desc)',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async findAllProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('rating') rating?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.productsService.findAllProducts({
      page,
      limit,
      category,
      minPrice,
      maxPrice,
      rating,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  @ModerateRateLimit()
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve detailed information about a specific product',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async findProductById(@Param('id') id: string) {
    return this.productsService.findProductById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOrVendor()
  @ModerateRateLimit()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new product',
    description: 'Create a new product (admin/vendor only)',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Vendor access required',
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async createProduct(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.createProduct(createProductDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
  @AdminOrVendor()
  @OwnProduct()
  @ModerateRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update product',
    description: 'Update an existing product (admin/vendor only)',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Vendor access required',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productsService.updateProduct(
      id,
      updateProductDto,
      req.user.id,
      req.user.isAdmin,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
  @AdminOrVendor()
  @OwnProduct()
  @ModerateRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete product',
    description: 'Delete a product (admin/vendor only)',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Vendor access required',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async deleteProduct(@Param('id') id: string, @Request() req) {
    return this.productsService.deleteProduct(
      id,
      req.user.id,
      req.user.isAdmin,
    );
  }

  @Get('categories/all')
  @ModerateRateLimit()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieve all product categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async getCategories() {
    return this.productsService.getCategories();
  }

  @Get('category/:categoryId')
  @ModerateRateLimit()
  @ApiOperation({
    summary: 'Get products by category',
    description: 'Retrieve products filtered by category',
  })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async getProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.productsService.getProductsByCategory(categoryId, {
      page,
      limit,
    });
  }

  @Get('filters/available')
  @ModerateRateLimit()
  @ApiOperation({
    summary: 'Get available filters',
    description: 'Retrieve available filter options for products',
  })
  @ApiResponse({
    status: 200,
    description: 'Filters retrieved successfully',
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async getAvailableFilters() {
    return this.productsService.getAvailableFilters();
  }

  @Post('filter')
  @SearchRateLimit()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Filter products',
    description: 'Apply advanced filters to products',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        categories: { type: 'array', items: { type: 'string' } },
        priceRange: {
          type: 'object',
          properties: {
            min: { type: 'number' },
            max: { type: 'number' },
          },
        },
        rating: { type: 'number' },
        inStock: { type: 'boolean' },
        onSale: { type: 'boolean' },
        featured: { type: 'boolean' },
        sortBy: { type: 'string' },
        sortOrder: { type: 'string', enum: ['asc', 'desc'] },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered products retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async filterProducts(@Body() filterData: any) {
    return this.productsService.findAllProducts(filterData);
  }

  @Get('search/query')
  @SearchRateLimit()
  @ApiOperation({
    summary: 'Search products',
    description: 'Search products by text query',
  })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - missing query' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async searchProducts(
    @Query('q') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.productsService.searchProducts(query, { page, limit });
  }
}

@ApiTags('Vendor Products')
@Controller('vendor/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@AdminOrVendor()
@ApiBearerAuth()
export class VendorProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ModerateRateLimit()
  @ApiOperation({
    summary: 'Get vendor products',
    description: 'Retrieve all products for the authenticated vendor',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Product status filter',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendor products retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Vendor access required',
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async getVendorProducts(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
  ) {
    return this.productsService.getVendorProducts(req.user.id);
  }
}
