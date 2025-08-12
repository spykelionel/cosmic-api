import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    createReview(userId: string, productId: string, createReviewDto: CreateReviewDto): Promise<{
        id: string;
        rating: number;
        comment: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    getProductReviews(productId: string, page?: number, limit?: number): Promise<{
        reviews: {
            id: string;
            rating: number;
            comment: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        averageRating: number;
    }>;
    updateReview(userId: string, reviewId: string, updateReviewDto: UpdateReviewDto): Promise<{
        id: string;
        rating: number;
        comment: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    deleteReview(userId: string, reviewId: string): Promise<{
        message: string;
    }>;
    getUserReviews(userId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            product: {
                name: string;
                id: string;
                images: string[];
            };
        } & {
            id: string;
            rating: number;
            comment: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getVendorProductReviews(vendorId: string, page?: number, limit?: number): Promise<{
        reviews: {
            id: string;
            rating: number;
            comment: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    private calculateAverageRating;
    private updateProductRating;
}
