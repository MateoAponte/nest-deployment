import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Subcategories } from './enums/subcategories';
import { Users } from 'src/users/users.entity';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Subcategories,
    array: true,
  }) // De este modo la DB ya entiende que es una lista de subcategorias
  subcategories: Subcategories[];

  @ManyToOne(() => Users, (user) => user.categories)
  user: Users;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deleteDate: Date;
}
