import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
