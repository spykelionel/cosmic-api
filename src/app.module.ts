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
