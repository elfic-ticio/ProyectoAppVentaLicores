import { CreateProductObjectSchema } from './create-product.dto';
import { z } from 'zod';

/**
 * UpdateProductDto makes all fields optional from CreateProductObjectSchema.
 */
export const UpdateProductDtoSchema = CreateProductObjectSchema.partial();

export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;
