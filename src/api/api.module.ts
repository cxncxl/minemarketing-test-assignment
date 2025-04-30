import { Module } from '@nestjs/common';

import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { RouterModule } from '@nestjs/core';

@Module({
    imports: [
        CategoryModule,
        ProductModule,
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
    ],
})
export class ApiModule {}
