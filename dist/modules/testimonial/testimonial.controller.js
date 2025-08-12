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
exports.TestimonialController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_testimonial_dto_1 = require("./dto/create-testimonial.dto");
const update_testimonial_dto_1 = require("./dto/update-testimonial.dto");
const testimonial_service_1 = require("./testimonial.service");
let TestimonialController = class TestimonialController {
    constructor(testimonialService) {
        this.testimonialService = testimonialService;
    }
    create(createTestimonialDto) {
        return this.testimonialService.create(createTestimonialDto);
    }
    findAll() {
        return this.testimonialService.findAll();
    }
    findOne(id) {
        return this.testimonialService.findOne(id);
    }
    update(id, updateTestimonialDto) {
        return this.testimonialService.update(id, updateTestimonialDto);
    }
    remove(id) {
        return this.testimonialService.remove(id);
    }
};
exports.TestimonialController = TestimonialController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_testimonial_dto_1.CreateTestimonialDto]),
    __metadata("design:returntype", void 0)
], TestimonialController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestimonialController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestimonialController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_testimonial_dto_1.UpdateTestimonialDto]),
    __metadata("design:returntype", void 0)
], TestimonialController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestimonialController.prototype, "remove", null);
exports.TestimonialController = TestimonialController = __decorate([
    (0, swagger_1.ApiTags)('Testimonial'),
    (0, common_1.Controller)('testimonial'),
    __metadata("design:paramtypes", [testimonial_service_1.TestimonialService])
], TestimonialController);
//# sourceMappingURL=testimonial.controller.js.map