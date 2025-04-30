import { Injectable } from '@nestjs/common';
import { DataSource, LessThan } from 'typeorm';

import { DbOperation } from './db-operation.interface';
import { StockUpdate } from '../model/stock-update.model';
import { Product } from '../model/product.model';
import { Logger } from 'src/shared/logger/logger';

@Injectable()
export class UpdateStocksDbOperation implements DbOperation<void, void> {
    constructor(
        private readonly dataSource: DataSource,
    ) {}

    public async execute(_: void): Promise<void> {
        const query = this.dataSource.createQueryRunner();

        await query.connect()
        await query.startTransaction();

        const products = await query.manager.findBy(
            Product,
            {
                stock: LessThan(10),
            }
        );

        if (!products || products.length == 0) {
            return;
        }

        const updates = [];

        for (const product of products) {
            const newStock = product.stock + Math.floor((Math.random() * 15) + 5);

            const update = new StockUpdate();
            update.product = product;
            update.oldStock = product.stock;
            update.newStock = newStock;
            update.updatedAt = new Date();

            updates.push(update);

            product.stock = newStock;
            product.updatedAt = new Date();
        }

        try {
            await query.manager.save(products);
            await query.manager.save(updates);
        } catch (e) {
            await query.rollbackTransaction();
            Logger.error('Failed to update stocks:', e);
        } finally {
            await query.commitTransaction();
            Logger.info('Updated', updates.length, 'stocks');
        }
    }
}
