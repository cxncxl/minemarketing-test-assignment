import {
    Body,
	Controller,
	Get,
	InternalServerErrorException,
	Post,
    Query
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, GetCategoriesDto } from './category.dto';
import { Logger } from 'src/shared/logger/logger';
import { defaultPageSize } from 'src/db/operations/db-operation.interface';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly service: CategoryService,
    ) {}

    @Get()
    async getCategories(
        @Query() query: GetCategoriesDto,
    ) {
        try {
            const categories = this.service.getCategories(query.page, query.limit);
            return {
                categories,
                pagination: {
                    next_page: query.page ?? 0 + 1,
                    limit: query.limit ?? defaultPageSize,
                },
            };
        } catch (e) {
            Logger.error(e);
            throw new InternalServerErrorException();
        }
    }

    @Post()
    async createCategory(
        @Body() body: CreateCategoryDto,
    ) {
        try {
            return this.service.createCategory(body.name);
        } catch (e) {
            Logger.error(e);
            throw new InternalServerErrorException();
        }
    }
}
