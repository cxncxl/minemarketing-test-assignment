import { Type } from 'class-transformer';
import {
    IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Min
} from 'class-validator';

export class GetCategoriesDto {
    @IsInt()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    page?: number

    @IsInt()
    @IsOptional()
    @Min(1)
    @Type(() => Number)
    limit?: number
}

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
