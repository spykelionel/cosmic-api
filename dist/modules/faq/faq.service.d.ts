import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
export declare class FaqService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createFaqDto: CreateFaqDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): any;
    update(id: string, updateFaqDto: UpdateFaqDto): Promise<any>;
    remove(id: string): Promise<any>;
}
