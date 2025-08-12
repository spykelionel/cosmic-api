import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { TestimonialService } from './testimonial.service';
export declare class TestimonialController {
    private readonly testimonialService;
    constructor(testimonialService: TestimonialService);
    create(createTestimonialDto: CreateTestimonialDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<any>;
    remove(id: string): Promise<any>;
}
