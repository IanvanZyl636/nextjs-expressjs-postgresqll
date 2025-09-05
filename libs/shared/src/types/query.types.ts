import { ProductStatus } from "../prisma/generated/enums";

export interface PaginationParams {
    limit?: number;
    offset?: number;
    q?: string;
};

export interface ProductQueryParams extends PaginationParams {
  status?: ProductStatus
}