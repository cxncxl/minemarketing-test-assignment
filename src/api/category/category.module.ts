import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from 'src/db/database.module';
import { Category } from 'src/db/model/category.model';
import { CategoryController } from './category.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        DatabaseModule,
    ],
    controllers: [
        CategoryController,
    ],
    providers: [
    ],
})
export class CategoryModule {}
