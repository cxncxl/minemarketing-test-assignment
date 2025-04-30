import { Repository } from 'typeorm';
import { Category } from '../model/category.model';
import { DbOperation, defaultPageSize } from './db-operation.interface';
import { InjectRepository } from '@nestjs/typeorm';

export class GetCategoriesDbOperation implements DbOperation<GetCategoriesFilter, Category[]> {
    constructor(
        @InjectRepository(Category)
        private readonly repository: Repository<Category>,
    ) {}

    public async execute(input: GetCategoriesFilter) {
        return await this.repository
            .createQueryBuilder('category')
            .skip(input.page ?? 0 * input.limit ?? defaultPageSize)
            .take(input.limit ?? defaultPageSize)
            .leftJoinAndSelect('category.products', 'product')
            .getMany();
    }
}

export type GetCategoriesFilter = {
    page?: number
    limit?: number
};
