import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { DbOperation, InvalidInputError, UnknownEntityError } from './db-operation.interface';
import { Product } from '../model/product.model';

@Injectable()
export class UpdateProductDbOperation implements DbOperation<UpdateProductInput, Product> {
    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>,
    ) {}

    public async execute(input: UpdateProductInput): Promise<Product> {
        if (
            !input.data.name
            && input.data.stock === undefined
            && input.data.price === undefined
        ) {
            throw new InvalidInputError();
        }

        const product = await this.repository.findOneBy({
            id: input.id,
        });

        if (!product) {
            throw new UnknownEntityError();
        }

        if (input.data.name) {
            product.name = input.data.name;
        }

        if (input.data.stock) {
            product.stock = input.data.stock;
        }

        if (input.data.price) {
            product.price = input.data.price;
        }

        product.updatedAt = new Date();

        return await this.repository.save(product);
    }
}

export class UpdateProductInput {
    id: string
    data: {
        name?: string,
        stock?: number,
        price?: number,
    }
}
