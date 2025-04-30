import {
    Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Param,
	Post,
    Put,
    Query
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { ProductService } from './product.service';
import {
    CreateProductDto,
	CreateProductResponse,
	DeleteProductParams,
	DeleteProductResponse,
	GetProductsDto,
	GetProductsResponse,
	ProductDto,
    UpdateProductDto,
    UpdateProductParams,
    UpdateProductResponse
} from './product.dto';
import { Pagination, PaginationUtils } from '../shared/pagination';
import { Logger } from '../../shared/logger/logger';
import { DuplicateValueError, InvalidInputError, InvalidRelationError, UnknownEntityError } from 'src/db/operations/db-operation.interface';

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

            if (e instanceof InvalidInputError) {
                throw new HttpException({
                    error: 'invalid data passed',
                }, HttpStatus.BAD_REQUEST);
            }

            if (e instanceof InvalidRelationError) {
                throw new HttpException({
                    error: 'unknown categoryId',
                }, HttpStatus.BAD_REQUEST);
            }

            if (e instanceof DuplicateValueError) {
                throw new HttpException({
                    error: 'product with given sku already exists',
                    details: e.duplicateId,
                }, HttpStatus.CONFLICT);
            }

            throw new InternalServerErrorException();
        }
    }

    @Put('/:id')
    @ApiOperation({
        summary: 'Update a product',
    })
    @ApiBody({
        type: UpdateProductDto,
    })
    @ApiParam({
        name: 'id',
        type: String,
    })
    @ApiResponse({
        status: 200,
        type: UpdateProductResponse,
    })
    async updateProduct(
        @Param() params: UpdateProductParams,
        @Body() body: UpdateProductDto,
    ): Promise<UpdateProductResponse> {
        try {
            const updated = await this.service.updateProduct(
                params.id,
                body.name, body.stock, body.price,
            );

            return {
                product: ProductDto.fromModel(updated),
            };
        } catch (e) {
            Logger.error(e);

            if (e instanceof InvalidInputError) {
                throw new HttpException({
                    error: 'at least one of name, stock or price must be provided',
                }, HttpStatus.BAD_REQUEST);
            }

            if (e instanceof UnknownEntityError) {
                throw new HttpException({
                    error: 'product not found',
                }, HttpStatus.NOT_FOUND);
            }
        }
    }

    @Delete('/:id')
    @ApiOperation({
        summary: 'Delete a product',
    })
    @ApiParam({
        name: 'id',
        type: String,
    })
    @ApiResponse({
        status: '2XX',
        type: DeleteProductResponse,
    })
    async deleteProduct(
        @Param() params: DeleteProductParams,
    ): Promise<DeleteProductResponse> {
        try {
            await this.service.deleteProduct(params.id);

            return {
                status: 'ok',
            };
        } catch (e) {
            Logger.error(e);

            if (e instanceof UnknownEntityError) {
                throw new HttpException({
                    error: 'product not found',
                }, HttpStatus.NOT_FOUND);
            }

            throw new InternalServerErrorException();
        }
    }
}
