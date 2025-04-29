import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvInt, getEnvString } from 'src/shared/util/util';
import { CreateCategoryDbOperation } from './operations/create-category-db-operation';
import { GetCategoriesDbOperation } from './operations/get-categories-db-operation';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: getEnvString('DB_HOST'),
            port: getEnvInt('DB_PORT'),
            username: getEnvString('POSTGRES_USER'),
            password: getEnvString('POSTGRES_PASSWORD'),
            database: getEnvString('POSTGRES_DB'),
            autoLoadEntities: true,
            synchronize: true,
            logging: false,
        }),
    ],
    providers: [
        GetCategoriesDbOperation,
        CreateCategoryDbOperation,
    ],
    exports: [
        GetCategoriesDbOperation,
        CreateCategoryDbOperation,
    ],
})
export class DatabaseModule {}
