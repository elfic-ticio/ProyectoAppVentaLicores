import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductEntity } from '../domain/product.entity';
import { ConditionGrade } from '@merma/db';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skip = 0, take = 20): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      skip,
      take,
      orderBy: { id: 'desc' },
    });

    return products.map(this.mapToEntity);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    return this.mapToEntity(product);
  }

  async create(sellerId: string, data: Omit<ProductEntity, 'id' | 'sellerId'>): Promise<ProductEntity> {
    const product = await this.prisma.product.create({
      data: {
        sellerId,
        sku: data.sku,
        title: data.title,
        description: data.description,
        condition_grade: data.conditionGrade,
        original_price: data.originalPrice,
        sale_price: data.salePrice,
        stock: data.stock,
        images: data.images,
      },
    });

    return this.mapToEntity(product);
  }

  async update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity> {
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        sku: data.sku,
        title: data.title,
        description: data.description,
        condition_grade: data.conditionGrade,
        original_price: data.originalPrice,
        sale_price: data.salePrice,
        stock: data.stock,
        images: data.images,
      },
    });

    return this.mapToEntity(product);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  /**
   * Helper to map Prisma Product to Domain Entity.
   */
  private mapToEntity(p: any): ProductEntity {
    return {
      id: p.id,
      sellerId: p.sellerId,
      sku: p.sku,
      title: p.title,
      description: p.description,
      conditionGrade: p.condition_grade as ConditionGrade,
      originalPrice: p.original_price,
      salePrice: p.sale_price,
      stock: p.stock,
      images: p.images,
    };
  }
}
