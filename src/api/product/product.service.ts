import { Injectable } from '@nestjs/common';
import { CreateProductDbOperation } from 'src/db/operations/create-product-db-operation';
import { GetProductsDbOperation } from 'src/db/operations/get-products-db-operation';
import { Pagination } from '../shared/pagination';
import { UpdateProductDbOperation } from 'src/db/operations/update-product-db-operation';

@Injectable()
export class ProductService {
    constructor(
        private readonly getProductsDbOp: GetProductsDbOperation,
        private readonly createProductDbOp: CreateProductDbOperation,
        private readonly updateProductDbOp: UpdateProductDbOperation,
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
        return this.getProductsDbOp.execute({
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
        return this.createProductDbOp.execute({
            name, sku, categoryId, stock, price,
        });
    }

    public updateProduct(
        id: string,
        name?: string,
        stock?: number,
        price?: number,
    ) {
        return this.updateProductDbOp.execute({
            id,
            data: { name, stock, price },
        });
    }
}
