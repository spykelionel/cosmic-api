"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../core/guards/jwt.auth.guard");
const create_faq_dto_1 = require("./dto/create-faq.dto");
const update_faq_dto_1 = require("./dto/update-faq.dto");
const faq_service_1 = require("./faq.service");
let FaqController = class FaqController {
    constructor(faqService) {
        this.faqService = faqService;
    }
    create(createFaqDto) {
        return this.faqService.create(createFaqDto);
    }
    findAll() {
        return this.faqService.findAll();
    }
    findOne(id) {
        return this.faqService.findOne(id);
    }
    update(id, updateFaqDto) {
        return this.faqService.update(id, updateFaqDto);
    }
    remove(id) {
        return this.faqService.remove(id);
    }
};
exports.FaqController = FaqController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The FAQ entry has been successfully created.',
        schema: {
            example: {
                id: '60a79c9b9b1d9b5f5f5e8c8e',
                question: 'What is the meaning of life?',
                answer: 'Life is a journey of experiences and growth.',
                createdAt: '2024-07-23T00:00:00.000Z',
                updatedAt: '2024-07-23T00:00:00.000Z',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_faq_dto_1.CreateFaqDto]),
    __metadata("design:returntype", void 0)
], FaqController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a list of all FAQ entries.',
        schema: {
            example: [
                {
                    id: '60a79c9b9b1d9b5f5f5e8c8e',
                    question: 'What is the meaning of life?',
                    answer: 'Life is a journey of experiences and growth.',
                    createdAt: '2024-07-23T00:00:00.000Z',
                    updatedAt: '2024-07-23T00:00:00.000Z',
                },
            ],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FaqController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a single FAQ entry by ID.',
        schema: {
            example: {
                id: '60a79c9b9b1d9b5f5f5e8c8e',
                question: 'What is the meaning of life?',
                answer: 'Life is a journey of experiences and growth.',
                createdAt: '2024-07-23T00:00:00.000Z',
                updatedAt: '2024-07-23T00:00:00.000Z',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FaqController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The FAQ entry has been successfully updated.',
        schema: {
            example: {
                id: '60a79c9b9b1d9b5f5f5e8c8e',
                question: 'What is the meaning of life?',
                answer: 'Life is a journey of experiences and growth.',
                createdAt: '2024-07-23T00:00:00.000Z',
                updatedAt: '2024-07-23T00:00:00.000Z',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_faq_dto_1.UpdateFaqDto]),
    __metadata("design:returntype", void 0)
], FaqController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The FAQ entry has been successfully deleted.',
        schema: {
            example: {
                message: 'FAQ entry successfully deleted',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FaqController.prototype, "remove", null);
exports.FaqController = FaqController = __decorate([
    (0, swagger_1.ApiTags)('Faq'),
    (0, common_1.Controller)('faq'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [faq_service_1.FaqService])
], FaqController);
//# sourceMappingURL=faq.controller.js.map