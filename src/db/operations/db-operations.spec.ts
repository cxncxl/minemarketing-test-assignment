import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCategoryDbOperation } from './create-category-db-operation';
import { DuplicateValueError, InvalidInputError, InvalidRelationError } from './db-operation.interface';
import { Category } from '../model/category.model';
import { GetCategoriesDbOperation } from './get-categories-db-operation';
import { Pagination } from '../../api/shared/pagination';
import { CreateProductDbOperation } from './create-product-db-operation';
import { Product } from '../model/product.model';

describe('Create Category', () => {
    let op: CreateCategoryDbOperation;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateCategoryDbOperation,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        op = moduleRef.get(CreateCategoryDbOperation);
    });

    it('should be defined', () => {
        expect(op).toBeDefined();
    });

    it('should throw error if name is empty', async () => {
        let err: Error;

        try {
            await op.execute({ name: '' });
        } catch (e) {
            err = e;
        }

        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(InvalidInputError);
    });

    it('should call findOneBy and save on repository', async () => {
        let err: Error;

        try {
            await op.execute({ name: 'test category' });
        } catch (e) {
            err = e;
        }

        const expectedSearch = new Category();
        expectedSearch.name = 'test category';

        expect(err).toBeUndefined();
        expect(mockRepository.findOneBy).toHaveBeenCalledWith(expectedSearch);
        expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error if duplicate exists', async () => {
        const existingCategory = new Category();
        existingCategory.id = 'cat-dup-uuid-111';
        existingCategory.name = 'a duplicate';
        existingCategory.createdAt = new Date();

        mockRepository.findOneBy.mockReturnValueOnce(existingCategory);

        let err: Error;

        try {
            await op.execute({ name: 'a duplicate' });
        } catch (e) {
            err = e;
        }

        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(DuplicateValueError);
        expect((err as DuplicateValueError).duplicateId).toBe('cat-dup-uuid-111');
    });
});

describe('Get Categories', () => {
    let op: GetCategoriesDbOperation;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                GetCategoriesDbOperation,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        op = moduleRef.get(GetCategoriesDbOperation);
    });

    it('should be defined', () => {
        expect(op).toBeDefined();
    });

    it('should call query builder', async () => {
        await op.execute({
            pagination: new Pagination(1, 200),
        });

        expect(mockQueryBuilder.take).toHaveBeenCalledWith(200);
        expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    });
});

describe('Create Product', () => {
    let op: CreateProductDbOperation;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateProductDbOperation,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockRepository,
                },
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockProductRepository,
                },
            ],
        }).compile();

        op = moduleRef.get(CreateProductDbOperation);
    });

    it('should be defined', () => {
        expect(op).toBeDefined();
    });

    it('should create a product', async () => {
        mockRepository.findOneBy.mockReturnValueOnce({ id: 'cat-id' });

        await op.execute({
            categoryId: 'cat-id',
            name: 'product-name',
            sku: '123',
            stock: 1,
            price: 10.0,
        });

        expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 'cat-id' });
        expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if category does not exists', async () => {
        mockRepository.findOneBy.mockReturnValueOnce(undefined);

        let err: Error;
        try {
            await op.execute({
                categoryId: 'cat-id',
                name: 'product-name',
                sku: '123',
                stock: 1,
                price: 10.0,
            });
        } catch (e) {
            err = e;
        }

        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(InvalidRelationError);
    });

    it('should throw an error is sku is not unique', async () => {
        mockRepository.findOneBy.mockReturnValueOnce({ id: 'product-id' });
        mockProductRepository.findOneBy.mockReturnValueOnce({ id: 2 });

        let err: Error;
        try {
            await op.execute({
                categoryId: 'cat-id',
                name: 'product-name',
                sku: '123',
                stock: 1,
                price: 10.0,
            });
        } catch (e) {
            err = e;
        }

        expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({ sku: '123' });
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(DuplicateValueError);
        expect((err as DuplicateValueError).duplicateId).toBe(2);
    });
});

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

const mockProductRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};
