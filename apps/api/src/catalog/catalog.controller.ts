import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './application/product.service';
import { CreateProductDtoSchema, CreateProductDto } from './application/dto/create-product.dto';
import { UpdateProductDtoSchema, UpdateProductDto } from './application/dto/update-product.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@merma/db';
import { RequestWithUser } from '../common/guards/roles.guard';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('filter') filter?: string,
  ) {
    return this.productService.searchProducts(query || '', filter);
  }

  @Public()
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productService.getAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.getById(id);
  }

  @Roles(Role.SELLER, Role.ADMIN)
  @Post()
  async create(@Req() req: RequestWithUser, @Body() body: unknown) {
    const result = CreateProductDtoSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.flatten().fieldErrors);
    }
    return this.productService.create(req.user.sub, result.data);
  }

  @Roles(Role.SELLER, Role.ADMIN)
  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const result = UpdateProductDtoSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.flatten().fieldErrors);
    }
    return this.productService.update(req.user.sub, req.user.role, id, result.data);
  }

  @Roles(Role.SELLER, Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.productService.remove(req.user.sub, req.user.role, id);
  }
}
