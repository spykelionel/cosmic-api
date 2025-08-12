import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configureCloudinary } from './core/config/cloudinary.config';
import { AuthModule } from './modules/auth/auth.module';
import { ChannelModule } from './modules/channel/channel.module';
import { ContactModule } from './modules/contact/contact.module';
import { FaqModule } from './modules/faq/faq.module';
import { FeatureModule } from './modules/feature/feature.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { PeriodModule } from './modules/period/period.module';
import { QuestionModule } from './modules/question/question.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { StageModule } from './modules/stage/stage.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { TestimonialModule } from './modules/testimonial/testimonial.module';
import { PrismaModule } from './prisma/prisma.module';

// E-commerce modules
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
    ChannelModule,
    LessonModule,
    QuizModule,
    QuestionModule,
    ContactModule,
    StageModule,
    PeriodModule,
    FaqModule,
    TestimonialModule,
    FeatureModule,
    SubscriptionModule,

    // E-commerce modules
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
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'CLOUDINARY_CONFIG',
      useFactory: (configService: ConfigService) =>
        configureCloudinary(configService),
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
