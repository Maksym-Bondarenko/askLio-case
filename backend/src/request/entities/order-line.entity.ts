import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProcurementRequest } from './request.entity';

@Entity()
export class OrderLine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('decimal')
  unitPrice: number;

  @Column('int')
  amount: number;

  @Column()
  unit: string;

  @Column('decimal')
  totalPrice: number;

  @ManyToOne(() => ProcurementRequest, (req) => req.orderLines, {
    onDelete: 'CASCADE',
  })
  procurementRequest: ProcurementRequest;
}
