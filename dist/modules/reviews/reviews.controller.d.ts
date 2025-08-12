import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(req: any, productId: string, createReviewDto: CreateReviewDto): Promise<{
        id: string;
        rating: number;
        comment: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    getProductReviews(productId: string, page: number, limit: number): Promise<{
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
    updateReview(req: any, reviewId: string, updateReviewDto: UpdateReviewDto): Promise<{
        id: string;
        rating: number;
        comment: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    deleteReview(req: any, reviewId: string): Promise<{
        message: string;
    }>;
    getUserReviews(req: any, page: number, limit: number): Promise<{
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
    getVendorProductReviews(req: any, page: number, limit: number): Promise<{
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
}
export declare class ProductReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createProductReview(req: any, productId: string, createReviewDto: CreateReviewDto): Promise<{
        id: string;
        rating: number;
        comment: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    getProductReviews(productId: string, page: number, limit: number): Promise<{
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
}
