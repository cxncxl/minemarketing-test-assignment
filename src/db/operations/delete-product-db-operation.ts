import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbOperation, UnknownEntityError } from './db-operation.interface';
import { Product } from '../model/product.model';

@Injectable()
export class DeleteProductDbOperation implements DbOperation<DeleteProductInput, void> {
    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>,
    ) {}

    public async execute(input: DeleteProductInput): Promise<void> {
        const result = await this.repository.delete({
            id: input.id,
        });

        if (result.affected == 0) {
            throw new UnknownEntityError();
        }
    }
}

export class DeleteProductInput {
    id: string
}
