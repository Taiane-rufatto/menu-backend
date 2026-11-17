import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  icon: string;

  // ordem em que a categoria aparece no cardápio (menor número aparece primeiro)
  @Column({ name: 'display_order', type: 'integer', default: 0 })
  displayOrder: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
