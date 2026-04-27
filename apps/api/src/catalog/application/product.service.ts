import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProductRepository } from '../infrastructure/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from '../domain/product.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchService } from '../../search/search.service';
import { Role } from '@merma/db';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly prisma: PrismaService,
    private readonly search: SearchService,
  ) {}

  async getAll(page = 1, limit = 20): Promise<ProductEntity[]> {
    const skip = (page - 1) * limit;
    return this.productRepo.findAll(skip, limit);
  }

  async getById(id: string): Promise<ProductEntity> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async create(userId: string, dto: CreateProductDto): Promise<ProductEntity> {
    // 1. Validate user has a seller profile
    const seller = await this.prisma.seller.findUnique({ where: { userId } });
    if (!seller) {
      throw new ForbiddenException('Debes tener un perfil de vendedor para publicar productos');
    }

    // 2. Create product
    const product = await this.productRepo.create(seller.id, dto);

    // 3. Sync with Meilisearch
    await this.search.upsertProduct(product);

    return product;
  }

  async update(userId: string, userRole: Role, id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.getById(id);

    // Only owner or ADMIN can update
    if (userRole !== Role.ADMIN) {
      const seller = await this.prisma.seller.findUnique({ where: { userId } });
      if (!seller || product.sellerId !== seller.id) {
        throw new ForbiddenException('No tienes permiso para modificar este producto');
      }
    }

    const updated = await this.productRepo.update(id, dto);

    // Sync with Meilisearch
    await this.search.upsertProduct(updated);

    return updated;
  }

  async remove(userId: string, userRole: Role, id: string): Promise<void> {
    const product = await this.getById(id);

    // Only owner or ADMIN can delete
    if (userRole !== Role.ADMIN) {
      const seller = await this.prisma.seller.findUnique({ where: { userId } });
      if (!seller || product.sellerId !== seller.id) {
        throw new ForbiddenException('No tienes permiso para eliminar este producto');
      }
    }

    await this.productRepo.delete(id);

    // Sync with Meilisearch
    await this.search.deleteProduct(id);
  }

  async searchProducts(query: string, filters?: any) {
    return this.search.searchProducts(query, filters);
  }
}
