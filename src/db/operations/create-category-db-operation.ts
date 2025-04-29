import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from '../model/category.model';
import {
    DbOperation,
    DuplicateValueError,
    InvalidInputError,
} from './db-operation.interface';
import { Logger } from '../../shared/logger/logger';

@Injectable()
export class CreateCategoryDbOperation implements DbOperation<CreateCategoryInput, Category> {
    constructor(
        @InjectRepository(Category)
        private readonly repository: Repository<Category>,
    ) {}

    public async execute(input: CreateCategoryInput): Promise<Category | undefined> {
        if (!input.name || input.name == '') {
            throw new InvalidInputError();
        }

        const dup = await this.repository.findOneBy({
            name: input.name,
        });
        if (dup?.id) {
            throw new DuplicateValueError(dup.id);
        }

        const category = new Category();
        category.name = input.name;
        category.createdAt = new Date();

        try {
            await this.repository.save(category);
        } catch (e) {
            Logger.error('Inserting a category:', e);
            return undefined;
        }

        return category;
    }
}

export type CreateCategoryInput = {
    name: string   
}
