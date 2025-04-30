import {
    Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Post,
    Query
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto, CreateCategoryDto, CreateCategoryResponse, GetCategoriesDto, GetCategoriesResponse } from './category.dto';
import { Logger } from 'src/shared/logger/logger';
import { DuplicateValueError } from 'src/db/operations/db-operation.interface';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Pagination, PaginationUtils } from '../shared/pagination';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly service: CategoryService,
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Get list of categories',
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
                pagination: PaginationUtils.next(
                    new Pagination(query.page, query.limit),
                    categories?.length ?? 0,
                ),
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

            if (e instanceof DuplicateValueError) {
                throw new HttpException({
                    error: 'duplicate value',
                    details: {
                        duplicate: e.duplicateId,
                    },
                }, HttpStatus.CONFLICT);
            }

            throw new InternalServerErrorException();
        }
    }
}
