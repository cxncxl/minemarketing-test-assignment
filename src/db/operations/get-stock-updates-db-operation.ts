import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';

import { DbOperation, InvalidRelationError } from './db-operation.interface';
import { StockUpdate } from '../model/stock-update.model';
import { Pagination } from '../../api/shared/pagination';
import { Category } from '../model/category.model';

@Injectable()
export class GetStockUpdatesDbOperation implements DbOperation<GetStockUpdatesInput, StockUpdate[]> {
    constructor(
        @InjectRepository(StockUpdate)
        private readonly repository: Repository<StockUpdate>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    public async execute(input: GetStockUpdatesInput): Promise<StockUpdate[]> {
        const query = this.repository.createQueryBuilder('update');
        query.leftJoinAndSelect('update.product', 'product');

        if (input.categoryId) {
            const category = await this.categoryRepository.findOneBy({
                id: input.categoryId,
            });

            if (!category) {
                throw new InvalidRelationError();
            }

            query.andWhere('product.categoryId = :cid', { cid: input.categoryId });
        }

        if (input.date) {
            let dateFrom = DateTime.fromJSDate(input.date)
                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

            let dateTo: DateTime;
            if (!input.hour) {
                dateTo = dateFrom.plus({ days: 1 });
            } else {
                dateFrom = dateFrom.set({ hour: input.hour });
                dateTo = dateFrom.plus({ hour: 1 });
            }

            query.andWhere('update.updatedAt > :datefrom',
                { datefrom: dateFrom.toJSDate() });
            query.andWhere('update.updatedAt < :dateto',
                { dateto: dateTo.toJSDate() });
        }

        query.skip(input.pagination.skip);
        query.take(input.pagination.limit);

        return await query.getMany();
    }
}

export class GetStockUpdatesInput {
    date?: Date
    hour?: number
    categoryId?: string
    pagination?: Pagination = new Pagination()
}
