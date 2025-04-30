import { Injectable } from '@nestjs/common';
import { CreateProductDbOperation } from 'src/db/operations/create-product-db-operation';

@Injectable()
export class ProductService {
    constructor(
        private readonly CreateProductDbOp: CreateProductDbOperation,
    ) {}

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
