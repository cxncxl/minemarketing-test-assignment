import { Injectable } from '@nestjs/common';
import { GetStockUpdatesDbOperation } from 'src/db/operations/get-stock-updates-db-operation';
import { GetStockUpdatesResponse, StockUpdate } from './stock.dto';
import { Pagination, PaginationUtils } from '../shared/pagination';

@Injectable()
export class StockService {
    constructor(
        private readonly getStockUpdatesDbOp: GetStockUpdatesDbOperation,
    ) {}

    public async getStockUpdateLogs(
        categoryId?: string,
        date?: Date,
        hour?: number,
        page?: number,
        limit?: number,
    ): Promise<GetStockUpdatesResponse> {
        const logs = await this.getStockUpdatesDbOp.execute({
            categoryId, date, hour,
            pagination: new Pagination(page, limit),
        });

        const mapped: Record<string, StockUpdate> = {};

        for (const log of logs) {
            if (!mapped[log.product.categoryId]) {
                mapped[log.product.categoryId] = new StockUpdate();
                mapped[log.product.categoryId].updatesHistory = [];
                mapped[log.product.categoryId].totalUpdates = 0;
            }

            mapped[log.product.categoryId].updatesHistory.push({
                from: log.oldStock,
                to: log.newStock,
                at: log.updatedAt,
                productId: log.product.id,
            });
            mapped[log.product.categoryId].totalUpdates++;
        }

        return {
            updates: mapped,
            pagination: PaginationUtils.next(
                new Pagination(page, limit),
                logs.length,
            ),
        };
    }
}
