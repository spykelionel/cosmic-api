import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
export declare class TestimonialService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTestimonialDto: CreateTestimonialDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<any>;
    remove(id: string): Promise<any>;
}
