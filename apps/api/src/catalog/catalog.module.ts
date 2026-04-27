import { Module } from '@nestjs/common';
import { ProductService } from './application/product.service';
import { ProductRepository } from './infrastructure/product.repository';
import { CatalogController } from './catalog.controller';

@Module({
  controllers: [CatalogController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class CatalogModule {}
