import { Injectable } from '@nestjs/common';

import { CreateCategoryDbOperation } from 'src/db/operations/create-category-db-operation';
import { GetCategoriesDbOperation } from 'src/db/operations/get-categories-db-operation';

@Injectable()
export class CategoryService {
    constructor(
        private readonly getCategoriesDbOp: GetCategoriesDbOperation,
        private readonly createCategoryDbOp: CreateCategoryDbOperation,
    ) {}

    public async getCategories(page?: number, limit?: number) {
        return this.getCategoriesDbOp.execute({ page, limit });
    }

    public async createCategory(name: string) {
        return this.createCategoryDbOp.execute({ name });
    }
}
