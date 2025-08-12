"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const cloudinary_config_1 = require("./core/config/cloudinary.config");
const auth_module_1 = require("./modules/auth/auth.module");
const channel_module_1 = require("./modules/channel/channel.module");
const contact_module_1 = require("./modules/contact/contact.module");
const faq_module_1 = require("./modules/faq/faq.module");
const feature_module_1 = require("./modules/feature/feature.module");
const lesson_module_1 = require("./modules/lesson/lesson.module");
const period_module_1 = require("./modules/period/period.module");
const question_module_1 = require("./modules/question/question.module");
const quiz_module_1 = require("./modules/quiz/quiz.module");
const stage_module_1 = require("./modules/stage/stage.module");
const subscription_module_1 = require("./modules/subscription/subscription.module");
const testimonial_module_1 = require("./modules/testimonial/testimonial.module");
const prisma_module_1 = require("./prisma/prisma.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            channel_module_1.ChannelModule,
            lesson_module_1.LessonModule,
            quiz_module_1.QuizModule,
            question_module_1.QuestionModule,
            contact_module_1.ContactModule,
            stage_module_1.StageModule,
            period_module_1.PeriodModule,
            faq_module_1.FaqModule,
            testimonial_module_1.TestimonialModule,
            feature_module_1.FeatureModule,
            subscription_module_1.SubscriptionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: 'CLOUDINARY_CONFIG',
                useFactory: (configService) => (0, cloudinary_config_1.configureCloudinary)(configService),
                inject: [config_1.ConfigService],
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map