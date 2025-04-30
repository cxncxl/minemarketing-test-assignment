import { Injectable } from '@nestjs/common';
import { CreateProductDbOperation } from 'src/db/operations/create-product-db-operation';
import { GetProductsDbOperation } from 'src/db/operations/get-products-db-operation';
import { Pagination } from '../shared/pagination';

@Injectable()
export class ProductService {
    constructor(
        private readonly GetProductsDbOp: GetProductsDbOperation,
        private readonly CreateProductDbOp: CreateProductDbOperation,
    ) {}

    public getProducts(
        page?: number,
        limit?: number,
        categoryId?: string,
        minStock?: number,
        maxStock?: number,
        minPrice?: number,
        maxPrice?: number,
    ) {
        return this.GetProductsDbOp.execute({
            categoryId,
            stock: { min: minStock, max: maxStock },
            price: { min: minPrice, max: maxPrice },
            pagination: new Pagination(page, limit),
        });
    }

    public createProduct(
        name: string,
        sku: string,
        categoryId: string,
        stock: number,
        price: number,
    ) {
        return this.CreateProductDbOp.execute({
            name, sku, categoryId, stock, price,
        });
    }
}
