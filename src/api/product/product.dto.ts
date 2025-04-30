import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
    Min
} from 'class-validator';
import { Product } from 'src/db/model/product.model';
import { CategoryDto } from '../category/category.dto';
import { Type } from 'class-transformer';
import { PaginationResponse } from '../shared/pagination';

export class ProductDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    sku: string

    @ApiProperty()
    category: Partial<CategoryDto> 

    @ApiProperty()
    stock: number

    @ApiProperty()
    price: number

    @ApiProperty()
    createdAt: Date

    @ApiProperty({
        nullable: true,
    })
    updatedAt: Date

    public static fromModel(model: Product): ProductDto {
        return {
            id: model.id,
            name: model.name,
            sku: model.sku,
            category: model.category ? CategoryDto.fromModel(model.category) : undefined,
            stock: model.stock,
            price: model.price,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
}

export class GetProductsDto {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page?: number

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number

    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    categoryId?: string

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    minStock?: number

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    maxStock?: number

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    minPrice?: number

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    maxPrice?: number
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    sku: string

    @IsString()
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    categoryId: string

    @IsInt()
    @IsNotEmpty()
    @Min(0)
    @ApiProperty()
    stock: number

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @ApiProperty()
    price: number
}

export class CreateProductResponse {
    @ApiProperty()
    product: ProductDto
}

export class GetProductsResponse {
    @ApiProperty()
    products: ProductDto[]

    @ApiProperty()
    pagination: PaginationResponse
}
