import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCategoryDbOperation } from './create-category-db-operation';
import { DuplicateValueError, InvalidInputError } from './db-operation.interface';
import { Category } from '../model/category.model';

describe('Create Category', () => {
    let op: CreateCategoryDbOperation;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateCategoryDbOperation,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockCategoryRepository,
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
        expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith(expectedSearch);
        expect(mockCategoryRepository.save).toHaveBeenCalled();
    });

    it('should throw error if duplicate exists', async () => {
        const existingCategory = new Category();
        existingCategory.id = 'cat-dup-uuid-111';
        existingCategory.name = 'a duplicate';
        existingCategory.createdAt = new Date();

        mockCategoryRepository.findOneBy.mockReturnValueOnce(existingCategory);

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

const mockCategoryRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
};
