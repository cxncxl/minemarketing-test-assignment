import { Repository } from 'typeorm';
import { Category } from '../model/category.model';
import { DbOperation } from './db-operation.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from '../../api/shared/pagination';

export class GetCategoriesDbOperation implements DbOperation<GetCategoriesFilter, Category[]> {
    constructor(
        @InjectRepository(Category)
        private readonly repository: Repository<Category>,
    ) {}

    public async execute(input: GetCategoriesFilter) {
        return await this.repository
            .createQueryBuilder('category')
            .skip(input.pagination.skip)
            .take(input.pagination.limit)
            .leftJoinAndSelect('category.products', 'product')
            .getMany();
    }
}

export class GetCategoriesFilter {
    pagination: Pagination = new Pagination()
};
