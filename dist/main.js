"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
        logger: ['error', 'warn', 'log'],
    });
    const swagConfig = new swagger_1.DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('API Documentation')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        name: 'Authorization',
        bearerFormat: 'JWT',
        in: 'header',
    }, 'JWT')
        .build();
    swagger_1.SwaggerModule.setup('/swagger', app, swagger_1.SwaggerModule.createDocument(app, swagConfig), {
        explorer: true,
        swaggerOptions: {
            docExpansion: 'none',
            filter: true,
            showRequestHeaders: true,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const PORT = process.env.PORT || 8000;
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map