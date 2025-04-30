import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min
} from 'class-validator';
import { Category } from 'src/db/model/category.model';
import { PaginationResponse, PaginationUtils } from '../shared/pagination';


@ApiSchema()
export class CategoryDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty({
        nullable: true,
    })
    updatedAt: Date

    @ApiProperty()
    products: string[]


    public static fromModel(model: Category): CategoryDto {
        return {
            id: model.id,
            name: model.name,
            products: model.products?.map(p => p.id),
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }
}

export class GetCategoriesDto {
    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    @Transform(val => parseInt(val.value))
    page?: number

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(PaginationUtils.defaultPageSize)
    @Type(() => Number)
    limit?: number
}

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        type: String,
        description: 'Categories name',
    })
    name: string;
}

export class GetCategoriesResponse {
    @ApiProperty({
        description: 'List of categories',
        type: Array<CategoryDto>,
    })
    categories: CategoryDto[]
    @ApiProperty({
        type: PaginationResponse,
    })
    pagination?: PaginationResponse
};

export class CreateCategoryResponse {
    @ApiProperty()
    category: CategoryDto
}
