import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DbOperation } from './db-operation.interface';
import { Product } from '../model/product.model';
import { Repository } from 'typeorm';
import { Pagination } from 'src/api/shared/pagination';

@Injectable()
export class GetProductsDbOperation implements DbOperation<GetProductsInput, Product[]> {
    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>,
    ) {}

    public async execute(input: GetProductsInput): Promise<Product[]> {
        const query = this.repository.createQueryBuilder('product');
        
        if (input.categoryId) {
            query.andWhere('product.categoryId = :id', { id: input.categoryId });
        }

        if (input.stock) {
            if (input.stock.min !== undefined) {
                query.andWhere('stock >= :minStock', { minStock: input.stock.min });
            }
            if (input.stock.max !== undefined) {
                query.andWhere('stock <= :maxStock', { maxStock: input.stock.max });
            }
        }

        if (input.price) {
            if (input.price.min !== undefined) {
                query.andWhere('price >= :minPrice', { minPrice: input.price.min });
            }
            if (input.price.max !== undefined) {
                query.andWhere('price <= :maxPrice', { maxPrice: input.price.max });
            }
        }

        query.leftJoin('product.category', 'category');
        query.addSelect(['category.id', 'category.name']);

        query.skip(input.pagination.skip);
        query.take(input.pagination.limit);

        return await query.getMany();
    }
}

export class GetProductsInput {
    categoryId?: string
    stock?: {
        min?: number,
        max?: number,
    }
    price?: {
        min?: number,
        max?: number,
    }
    pagination: Pagination = new Pagination()
}
