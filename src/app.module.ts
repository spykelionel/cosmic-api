import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { configureCloudinary } from './core/config/cloudinary.config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';

// E-commerce modules
import { ResponseTemplateInterceptor } from './core/interceptors/response-template/response-template.interceptor';
import { AdminModule } from './modules/admin/admin.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    UsersModule,
    ReviewsModule,
    WishlistModule,
    AdminModule,
    PaymentModule,
    UploadModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'CLOUDINARY_CONFIG',
      useFactory: (configService: ConfigService) =>
        configureCloudinary(configService),
      inject: [ConfigService],
    },
    ResponseTemplateInterceptor,
  ],
})
export class AppModule {}
