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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqService = void 0;
const common_1 = require("@nestjs/common");
const utility_service_1 = require("../../core/services/utility.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let FaqService = class FaqService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFaqDto) {
        try {
            const { question, answer } = createFaqDto;
            const faq = await this.prisma.faq.create({
                data: {
                    question,
                    answer,
                },
            });
            return faq;
        }
        catch (error) {
            return (0, utility_service_1.httpErrorException)(error);
        }
    }
    async findAll() {
        return await this.prisma.faq.findMany();
    }
    findOne(id) {
        return this.prisma.faq.findFirst({ where: { id } });
    }
    async update(id, updateFaqDto) {
        try {
            const faq = await this.prisma.faq.findFirst({ where: { id } });
            if (!faq) {
                return 'No FAQ with such ID exist';
            }
            const { question, answer } = updateFaqDto;
            const updatedFaq = await this.prisma.faq.update({
                where: { id },
                data: {
                    question,
                    answer,
                },
            });
            return updatedFaq;
        }
        catch (error) {
            return (0, utility_service_1.httpErrorException)(error);
        }
    }
    async remove(id) {
        try {
            const faq = await this.prisma.faq.findFirst({ where: { id } });
            if (!faq) {
                return 'No FAQ with such ID exist';
            }
            const deletedFaq = await this.prisma.faq.delete({
                where: { id },
            });
            return deletedFaq;
        }
        catch (error) {
            return (0, utility_service_1.httpErrorException)(error);
        }
    }
};
exports.FaqService = FaqService;
exports.FaqService = FaqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FaqService);
//# sourceMappingURL=faq.service.js.map