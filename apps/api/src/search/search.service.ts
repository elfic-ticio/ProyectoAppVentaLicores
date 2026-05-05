import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch, Index } from 'meilisearch';
import { ProductEntity } from '../catalog/domain/product.entity';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: MeiliSearch;
  private readonly logger = new Logger(SearchService.name);
  private productIndex: Index;

  constructor(config: ConfigService) {
    const host = config.get<string>('MEILI_HOST');
    const apiKey = config.get<string>('MEILI_MASTER_KEY');
    if (host) {
      this.client = new MeiliSearch({ host, apiKey });
      this.productIndex = this.client.index('products');
    }
  }

  async onModuleInit() {
    if (!this.client) {
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
    try {
      await this.productIndex.addDocuments([product]);
    } catch (error) {
      this.logger.error(`Failed to index product ${product.id}`, error);
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.productIndex.deleteDocument(id);
    } catch (error) {
      this.logger.error(`Failed to delete product ${id} from index`, error);
    }
  }

  async searchProducts(query: string, filters?: any) {
    return this.productIndex.search(query, {
      filter: filters,
      limit: 20,
    });
  }
}
