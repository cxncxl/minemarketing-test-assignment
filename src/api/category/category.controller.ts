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
            return this.service.getCategories(query.page, query.limit);
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
