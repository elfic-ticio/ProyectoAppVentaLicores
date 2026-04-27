import { z } from 'zod';
import { ConditionGrade } from '@merma/db';

export const CreateProductObjectSchema = z.object({
  sku: z.string().min(3, 'SKU debe tener al menos 3 caracteres'),
  title: z.string().min(5, 'El título es muy corto').max(100),
  description: z.string().min(20, 'La descripción debe ser más detallada'),
  conditionGrade: z.nativeEnum(ConditionGrade),
  originalPrice: z.number().positive('El precio original debe ser mayor a 0'),
  salePrice: z.number().positive('El precio de venta debe ser mayor a 0'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  images: z.array(z.string().url('URL de imagen inválida')).min(1, 'Debe incluir al menos una imagen'),
});

export const CreateProductDtoSchema = CreateProductObjectSchema.refine(data => data.salePrice <= data.originalPrice, {
  message: 'El precio de venta no puede ser mayor al original',
  path: ['salePrice'],
});

export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;
