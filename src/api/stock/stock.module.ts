import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/db/database.module';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';

@Module({
    imports: [
        DatabaseModule,
    ],
    providers: [
        StockService,
    ],
    controllers: [
        StockController,
    ],
})
export class StockModule {}
