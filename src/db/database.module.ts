import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvInt, getEnvString } from 'src/shared/util/util';
import { CreateCategoryDbOperation } from './operations/create-category-db-operation';
import { GetCategoriesDbOperation } from './operations/get-categories-db-operation';
import { ConfigModule } from '@nestjs/config';
import { Category } from './model/category.model';
import { Product } from './model/product.model';
import { CreateProductDbOperation } from './operations/create-product-db-operation';
import { GetProductsDbOperation } from './operations/get-products-db-operation';
import { UpdateProductDbOperation } from './operations/update-product-db-operation';
import { DeleteProductDbOperation } from './operations/delete-product-db-operation';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: getEnvString('DB_HOST'),
            port: getEnvInt('DB_PORT'),
            username: getEnvString('POSTGRES_USER'),
            password: getEnvString('POSTGRES_PASSWORD'),
            database: getEnvString('POSTGRES_DB'),
            entities: [
                Category,
                Product,
            ],
            logging: false,
        }),
        TypeOrmModule.forFeature([Category, Product]),
    ],
    providers: [
        GetCategoriesDbOperation,
        CreateCategoryDbOperation,

        GetProductsDbOperation,
        CreateProductDbOperation,
        UpdateProductDbOperation,
        DeleteProductDbOperation,
    ],
    exports: [
        GetCategoriesDbOperation,
        CreateCategoryDbOperation,

        GetProductsDbOperation,
        CreateProductDbOperation,
        UpdateProductDbOperation,
        DeleteProductDbOperation,
    ],
})
export class DatabaseModule {}
