import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
	IsNotEmpty,
	IsNumber,
	IsString,
	IsUUID,
    Min
} from 'class-validator';
import { Product } from 'src/db/model/product.model';
import { CategoryDto } from '../category/category.dto';

export class ProductDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    sku: string

    @ApiProperty()
    category: CategoryDto 

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
            category: CategoryDto.fromModel(model.category),
            stock: model.stock,
            price: model.price,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
}

export class CreateProductResponse {
    @ApiProperty()
    product: ProductDto
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
