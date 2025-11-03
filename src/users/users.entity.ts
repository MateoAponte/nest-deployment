import {
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { Posts } from 'src/posts/posts.entity';
import { Categories } from 'src/categories/categories.entity';
import { Activities } from './enums/Activities';
import { Roles } from './enums/Roles';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;
  @Column({
    unique: true,
    length: 100,
  })
  email: string;
  @Column({
    type: 'varchar',
    length: 100,
  })
  password: string;

  @Column({
    enum: Roles,
    default: Roles.USER,
  })
  rol: Roles;
  @Column({
    type: 'enum',
    enum: Activities,
    array: true,
  })
  activities: Activities[];

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];

  @OneToMany(() => Categories, (category) => category.user)
  categories: Categories[];

  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
