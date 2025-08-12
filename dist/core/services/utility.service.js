"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImageFileName = exports.httpErrorException = exports.generateSlug = void 0;
const common_1 = require("@nestjs/common");
function generateSlug(phrase) {
    return phrase
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
exports.generateSlug = generateSlug;
function httpErrorException(error) {
    throw new common_1.HttpException(error, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
}
exports.httpErrorException = httpErrorException;
function generateImageFileName(extension) {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const randomNumber = Math.floor(Math.random() * 10000);
    return `${timestamp}_${randomNumber}.${extension}`;
}
exports.generateImageFileName = generateImageFileName;
//# sourceMappingURL=utility.service.js.map