import {
    Body,
	Controller,
	Get,
	InternalServerErrorException,
	Post,
    Query
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto, CreateCategoryDto, CreateCategoryResponse, GetCategoriesDto, GetCategoriesResponse } from './category.dto';
import { Logger } from 'src/shared/logger/logger';
import { defaultPageSize } from 'src/db/operations/db-operation.interface';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly service: CategoryService,
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Get list of categories',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        default: 0,
        description: 'Pagination page',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        minimum: 1,
        maximum: defaultPageSize,
        default: defaultPageSize,
        description: 'Amount of records to take',
    })
    @ApiResponse({
        status: 200,
        type: GetCategoriesResponse,
    })
    async getCategories(
        @Query() query: GetCategoriesDto,
    ): Promise<GetCategoriesResponse> {
        try {
            const categories = await this.service.getCategories(query.page, query.limit);
            return {
                categories: categories?.map(CategoryDto.fromModel),
                pagination: {
                    nextPage: (query.page ?? 0) + 1,
                    limit: query.limit ?? defaultPageSize,
                },
            };
        } catch (e) {
            Logger.error(e);
            throw new InternalServerErrorException();
        }
    }

    @Post()
    @ApiOperation({
        summary: 'Create a category',
    })
    @ApiBody({
        type: CreateCategoryDto,
        required: true,
    })
    @ApiResponse({
        status: 201,
        type: CreateCategoryResponse,
    })
    async createCategory(
        @Body() body: CreateCategoryDto,
    ): Promise<CreateCategoryResponse> {
        try {
            const category = await this.service.createCategory(body.name);
            return {
                category: CategoryDto.fromModel(category),
            };
        } catch (e) {
            Logger.error(e);
            throw new InternalServerErrorException();
        }
    }
}
