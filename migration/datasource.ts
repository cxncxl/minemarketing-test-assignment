import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { Category } from '../src/db/model/category.model';
import { Product } from '../src/db/model/product.model';
import { getEnvInt, getEnvString } from '../src/shared/util/util';
import { StockUpdate } from '../src/db/model/stock-update.model';

config();

export default new DataSource({
    type: 'postgres',
    host: getEnvString('DB_HOST'),
    port: getEnvInt('DB_PORT'),
    username: getEnvString('POSTGRES_USER'),
    password: getEnvString('POSTGRES_PASSWORD'),
    database: getEnvString('POSTGRES_DB'),
    entities: [
        Category,
        Product,
        StockUpdate,
    ],
    migrations: [
        './migration/migrations/*.ts'
    ],
    synchronize: false,
    logging: true,
})
