import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { DbOperation, DuplicateValueError, InvalidRelationError } from './db-operation.interface';
import { Product } from '../model/product.model';
import { Category } from '../model/category.model';

@Injectable()
export class CreateProductDbOperation implements DbOperation<CreateProductInput, Product> {
    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    public async execute(input: CreateProductInput): Promise<Product> {
        const category = await this.categoryRepository.findOneBy({
            id: input.categoryId,
        });

        if (!category) {
            throw new InvalidRelationError();
        }

        const dup = await this.repository.findOneBy({
            sku: input.sku,
        });

        if (dup) {
            throw new DuplicateValueError(dup.id);
        }

        const product = new Product();
        product.name = input.name;
        product.sku = input.sku;
        product.category = category;
        product.stock = input.stock;
        product.price = input.price;
        product.createdAt = new Date();

        return await this.repository.save(product);
    }
}

export class CreateProductInput {
    name: string
    sku: string
    categoryId: string
    stock: number
    price: number
}
