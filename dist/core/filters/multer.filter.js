"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
let MulterExceptionFilter = class MulterExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        response.status(status).json({
            statusCode: status,
            message: exception.code === 'LIMIT_FILE_SIZE'
                ? 'File size exceeds the limit of 5MB'
                : 'File upload error',
            error: exception.message,
        });
    }
};
exports.MulterExceptionFilter = MulterExceptionFilter;
exports.MulterExceptionFilter = MulterExceptionFilter = __decorate([
    (0, common_1.Catch)(multer_1.MulterError)
], MulterExceptionFilter);
//# sourceMappingURL=multer.filter.js.map