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
exports.TestimonialService = void 0;
const common_1 = require("@nestjs/common");
const utility_service_1 = require("../../core/services/utility.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let TestimonialService = class TestimonialService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTestimonialDto) {
        try {
            const { name, message } = createTestimonialDto;
            const testimonial = await this.prisma.testimonial.create({
                data: {
                    name,
                    message,
                },
            });
            return testimonial;
        }
        catch (error) {
            return (0, utility_service_1.httpErrorException)(error);
        }
    }
    async findAll() {
        return await this.prisma.testimonial.findMany();
    }
    async findOne(id) {
        return await this.prisma.testimonial.findFirst({ where: { id } });
    }
    async update(id, updateTestimonialDto) {
        try {
            const { name } = updateTestimonialDto;
            const testimonial = await this.prisma.testimonial.update({
                where: { id },
                data: {
                    name,
                    ...updateTestimonialDto,
                },
            });
            return testimonial;
        }
        catch (error) {
            return (0, utility_service_1.httpErrorException)(error);
        }
    }
    async remove(id) {
        return await this.prisma.testimonial.delete({ where: { id } });
    }
};
exports.TestimonialService = TestimonialService;
exports.TestimonialService = TestimonialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestimonialService);
//# sourceMappingURL=testimonial.service.js.map