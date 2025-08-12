import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqService } from './faq.service';
export declare class FaqController {
    private readonly faqService;
    constructor(faqService: FaqService);
    create(createFaqDto: CreateFaqDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): any;
    update(id: string, updateFaqDto: UpdateFaqDto): Promise<any>;
    remove(id: string): Promise<any>;
}
