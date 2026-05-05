import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch, Index } from 'meilisearch';
import { ProductEntity } from '../catalog/domain/product.entity';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: MeiliSearch | null = null;
  private readonly logger = new Logger(SearchService.name);
  private productIndex: Index | null = null;

  constructor(config: ConfigService) {
    const host = config.get<string>('MEILI_HOST');
    const apiKey = config.get<string>('MEILI_MASTER_KEY');
    if (host) {
      this.client = new MeiliSearch({ host, apiKey });
      this.productIndex = this.client.index('products');
    }
  }

  async onModuleInit() {
    if (!this.client || !this.productIndex) {
      this.logger.warn('Meilisearch not configured — search disabled');
      return;
    }
    try {
      await this.productIndex.updateSettings({
        searchableAttributes: ['title', 'description', 'sku'],
        filterableAttributes: ['conditionGrade', 'sellerId', 'salePrice'],
        sortableAttributes: ['salePrice', 'createdAt'],
      });
      this.logger.log('Meilisearch "products" index settings updated');
    } catch (error) {
      this.logger.error('Failed to update Meilisearch settings', error);
    }
  }

  async upsertProduct(product: ProductEntity) {
    if (!this.productIndex) return;
    try {
      await this.productIndex.addDocuments([product]);
    } catch (error) {
      this.logger.error(`Failed to index product ${product.id}`, error);
    }
  }

  async deleteProduct(id: string) {
    if (!this.productIndex) return;
    try {
      await this.productIndex.deleteDocument(id);
    } catch (error) {
      this.logger.error(`Failed to delete product ${id} from index`, error);
    }
  }

  async searchProducts(query: string, filters?: any) {
    if (!this.productIndex) return { hits: [] };
    return this.productIndex.search(query, {
      filter: filters,
      limit: 20,
    });
  }
}
