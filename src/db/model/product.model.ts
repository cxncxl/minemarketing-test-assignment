import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

import { Category } from './category.model';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        length: 200,
        nullable: true,
    })
    name: string

    @Column({
        length: 50,
        nullable: false,
        unique: true,
    })
    sku: string

    @ManyToOne(
        () => Category,
        (category) => category.id,
    )
    category: Category

    @RelationId((product: Product) => product.category)
    categoryId: string;

    @Column({
        type: 'int',
        nullable: false,
        default: 0,
    })
    stock: number

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
        transformer: {
            to: (value: number) => value,
            from: (value: string): number => parseFloat(value),
        },
    })
    price: number

    @Column({
        type: 'timestamp',
        nullable: false,
    })
    createdAt: Date

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    updatedAt?: Date
}
