import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from 'src/db/database.module';
import { Category } from 'src/db/model/category.model';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        DatabaseModule,
    ],
    controllers: [
        CategoryController,
    ],
    providers: [
        CategoryService,
    ],
})
export class CategoryModule {}
