import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
    @Column({
        type: 'uuid',
        name: 'category_id',
    })
    categoryId: Category

    @Column({
        type: 'int',
        nullable: false,
        default: 0,
    })
    stock: Number

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
    })
    price: Number

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
