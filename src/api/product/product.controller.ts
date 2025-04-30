import {
    Body,
	Controller,
	InternalServerErrorException,
	Logger,
	Post
} from '@nestjs/common';

import { ProductService } from './product.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
    CreateProductDto,
	CreateProductResponse,
	ProductDto
} from './product.dto';

@Controller('product')
export class ProductController {
    constructor(
        private readonly service: ProductService,
    ) {}

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
