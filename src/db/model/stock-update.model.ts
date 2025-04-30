import {
    Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { Product } from './product.model';

@Entity()
export class StockUpdate {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(
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
