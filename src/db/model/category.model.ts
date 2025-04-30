import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.model';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        length: 100,
        unique: true,
        nullable: false,
    })
    name: string

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

    @OneToMany(
        () => Product,
        (product) => product.category,
    )
    products: Product[]
}
