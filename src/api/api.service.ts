import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateStocksDbOperation } from 'src/db/operations/update-stocks-db-operation';
import { Logger } from 'src/shared/logger/logger';

@Injectable()
export class ApiService {
    constructor(
        private readonly updateStocksDbOp: UpdateStocksDbOperation,
    ) {}

    @Cron(CronExpression.EVERY_6_HOURS)
    async cronCallback() {
        try {
            await this.updateStocksDbOp.execute();
        } catch (e) {
            Logger.error(e);
        }
    }
}
