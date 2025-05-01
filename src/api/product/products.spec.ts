import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { GetProductsDbOperation } from '../../db/operations/get-products-db-operation';
import { CreateProductDbOperation } from '../../db/operations/create-product-db-operation';
import { UpdateProductDbOperation } from '../../db/operations/update-product-db-operation';
import { DeleteProductDbOperation } from '../../db/operations/delete-product-db-operation';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../../db/model/category.model';
import { Product } from '../../db/model/product.model';
import { CreateProductResponse, GetProductsResponse } from './product.dto';
import { DuplicateValueError, InvalidRelationError, UnknownEntityError } from '../../db/operations/db-operation.interface';

describe('Products Module', () => {
    let controller: ProductController;
    let service: MockProductService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [
                ProductController,
            ],
            providers: [
                GetProductsDbOperation,
                CreateProductDbOperation,
                UpdateProductDbOperation,
                DeleteProductDbOperation,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockRepository,
                },
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockRepository,
                },
                {
                    provide: ProductService,
                    useClass: MockProductService,
                },
            ],
        }).compile();

        controller = moduleRef.get(ProductController);
        service = moduleRef.get(ProductService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    it('should return products', async () => {
        const mockProducts = getMockProducts(Math.ceil(Math.random() * 50));
        service.getProducts.mockReturnValueOnce(mockProducts);

        let err: Error;
        let res: GetProductsResponse;
        try {
            res = await controller.getProducts({
                page: 1,
                limit: 500,
            });
        } catch(e) {
            err = e;
        }

        expect(err).toBeUndefined();
        expect(res.products.length).toBe(mockProducts.length);

        mockProducts.forEach(product => {
            const productInRes = res.products.find(p => p.id == product.id);
            expect(productInRes).toBeDefined();
        });
    });

    it('pagination should work', async () => {
        const mockProducts = getMockProducts(100);
        service.getProducts.mockImplementationOnce((page, limit) => {
            return mockProducts.slice(page * limit, (page * limit) + limit);
        });

        let err: Error;
        let res: GetProductsResponse;
        try {
            res = await controller.getProducts({
                page: 1,
                limit: 20,
            });
        } catch (e) {
            err = e;
        }

        expect(err).toBeUndefined();
        expect(res.products.length).toBe(20);
        expect(res.pagination).toBeDefined();
        expect(res.pagination.nextPage).toBeDefined();
        expect(res.pagination.nextPage).toBe(2);
    });

    it('should create product', async () => {
        const mockProduct = {
            name: 'test insert product',
            sku: 'test-insert',
            stock: 4,
            price: 60.0,
            categoryId: 'cat-1',
        };
        service.createProduct.mockReturnValueOnce({
            ...mockProduct,
            id: 'product-123',
            createdAt: new Date(),
        });

        let err: Error;
        let res: CreateProductResponse;
        try {
            res = await controller.createProduct(mockProduct);
        } catch (e) {
            err = e;
        }

        expect(err).toBeUndefined();
        expect(res.product).toBeDefined();
        expect(res.product.id).toBe('product-123');
    });

    it('should return 429 if sku is not unique', async () => {
        const dupId = 'duplicate-product';
        service.createProduct.mockImplementationOnce(() => {
            throw new DuplicateValueError(dupId);
        });

        let err: Error;
        try {
            await controller.createProduct({
                name: 'test insert product',
                sku: 'test-insert',
                stock: 4,
                price: 60.0,
                categoryId: 'cat-1',
            });
        } catch(e) {
            err = e;
        }

        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.CONFLICT);
    });

    it('should throw 400 if category id is invalid', async () => {
        service.createProduct.mockImplementationOnce(() => {
            throw new InvalidRelationError();
        });

        let err: Error;
        try {
            await controller.createProduct({
                name: 'test insert product',
                sku: 'test-insert',
                stock: 4,
                price: 60.0,
                categoryId: 'cat-1',
            });
        } catch(e) {
            err = e;
        }

        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should throw 404 if updating not existing product', async () => {
        service.updateProduct.mockImplementationOnce(() => {
            throw new UnknownEntityError();
        });

        let err: Error;
        try {
            await controller.updateProduct(
                { id: 'mock-id' },
                { name: 'new-name' },
            );
        } catch (e) {
            err = e;
        }

        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

    it('should throw 404 if deleting not existing product', async () => {
        service.deleteProduct.mockImplementationOnce(() => {
            throw new UnknownEntityError();
        });

        let err: Error;
        try {
            await controller.deleteProduct(
                { id: 'mock-id' },
            );
        } catch (e) {
            err = e;
        }

        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

});

export class MockProductService extends ProductService {
    override getProductsDbOp = undefined;
    override createProductDbOp = undefined;
    override updateProductDbOp = undefined;
    override deleteProductDbOp = undefined;

    getProducts = jest.fn();
    createProduct = jest.fn();
    updateProduct = jest.fn();
    deleteProduct = jest.fn();
}

const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
};

const mockRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

function getMockProducts(len: number) {
    const mockProducts = [];

    for (let i = 0; i < len; i++) {
        const mockProduct = new Product();
        mockProduct.id = `abc-def-${i}`;
        mockProduct.name = `mock product ${i}`;
        mockProduct.sku = `mock-${i}`;
        mockProduct.stock = Math.ceil(Math.random() * 20);
        mockProduct.price = Math.random() * 400;

        mockProducts.push(mockProduct);
    }

    return mockProducts;
}
