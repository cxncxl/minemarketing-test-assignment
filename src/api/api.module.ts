import { Module } from '@nestjs/common';

import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiService } from './api.service';
import { DatabaseModule } from 'src/db/database.module';
import { StockModule } from './stock/stock.module';

@Module({
    imports: [
        CategoryModule,
        ProductModule,
        StockModule,
        RouterModule.register([
            {
                path: 'api',
                module: CategoryModule,
            },
            {
                path: 'api',
                module: ProductModule,
            },
        ]),
        ScheduleModule.forRoot(),
        DatabaseModule,
    ],
    providers: [
        ApiService,
    ],
})
export class ApiModule {}
