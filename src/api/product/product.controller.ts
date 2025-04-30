import {
    Body,
	Controller,
	Get,
	InternalServerErrorException,
	Post,
    Query
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ProductService } from './product.service';
import {
    CreateProductDto,
	CreateProductResponse,
	GetProductsDto,
	GetProductsResponse,
	ProductDto
} from './product.dto';
import { Pagination, PaginationUtils } from '../shared/pagination';
import { Logger } from '../../shared/logger/logger';

@Controller('product')
export class ProductController {
    constructor(
        private readonly service: ProductService,
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Get list of products',
    })
    async getProducts(
        @Query() query: GetProductsDto,
    ): Promise<GetProductsResponse> {
        try {
            const products = await this.service.getProducts(
                query.page, query.limit,
                query.categoryId,
                query.minStock, query.maxStock,
                query.minPrice, query.maxPrice,
            );

            return {
                products: products.map(p => ProductDto.fromModel(p)),
                pagination: PaginationUtils.next(
                    new Pagination(query.page, query.limit),
                    products?.length ?? 0,
                ),
            }
        } catch (e) {
            Logger.error(e);
            throw new InternalServerErrorException();
        }
    }

    @Post()
    @ApiOperation({
        summary: 'Create a product',
    })
    @ApiBody({
        type: CreateProductDto,
        required: true,
    })
    @ApiResponse({
        status: 201,
        type: CreateProductResponse,
    })
    async createProduct(
        @Body() body: CreateProductDto,
    ): Promise<CreateProductResponse> {
        try {
            const product = await this.service.createProduct(
                body.name,
                body.sku,
                body.categoryId,
                body.stock,
                body.price,
            );
            
            return {
                product: ProductDto.fromModel(product),
            };
        } catch (e) {
            Logger.error(e);
            throw new InternalServerErrorException();
        }
    }
}
