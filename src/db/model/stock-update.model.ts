import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Product } from './product.model';

@Entity()
export class StockUpdate {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(
        () => Product,
        (product) => product.id,
    )
    @JoinColumn({ name: 'productId' })
    product: Product

    @Column('int')
    oldStock: number

    @Column('int')
    newStock: number

    @Column('timestamp')
    updatedAt: Date
}
