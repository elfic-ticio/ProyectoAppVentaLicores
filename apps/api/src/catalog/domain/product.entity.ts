import { ConditionGrade } from '@merma/db';

/**
 * Pure domain entity for Product.
 * Decoupled from Prisma types to allow domain logic to evolve independently.
 */
export interface ProductEntity {
  id: string;
  sellerId: string;
  sku: string;
  title: string;
  description: string;
  conditionGrade: ConditionGrade;
  originalPrice: number;
  salePrice: number;
  stock: number;
  images: string[];
}
