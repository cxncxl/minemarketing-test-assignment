import { Injectable } from '@nestjs/common';
import { CreateProductDbOperation } from '../../db/operations/create-product-db-operation';
import { GetProductsDbOperation } from '../../db/operations/get-products-db-operation';
import { UpdateProductDbOperation } from '../../db/operations/update-product-db-operation';
import { DeleteProductDbOperation } from '../../db/operations/delete-product-db-operation';
import { Pagination } from '../shared/pagination';

@Injectable()
export class ProductService {
    constructor(
        protected readonly getProductsDbOp: GetProductsDbOperation,
        protected readonly createProductDbOp: CreateProductDbOperation,
        protected readonly updateProductDbOp: UpdateProductDbOperation,
        protected readonly deleteProductDbOp: DeleteProductDbOperation,
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

    public deleteProduct(
        id: string,
    ) {
        return this.deleteProductDbOp.execute({ id });
    }
}
