import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderLine } from './order-line.entity';

@Entity()
export class ProcurementRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requestorName: string;

  @Column()
  title: string;

  @Column()
  vendorName: string;

  @Column()
  vatId: string;

  @Column()
  department: string;

  @Column()
  totalCost: number;

  @Column({ default: 'Open' })
  status: string;

  @OneToMany(() => OrderLine, (line) => line.procurementRequest, {
    cascade: true,
    eager: true, // auto-load
  })
  orderLines: OrderLine[];
}
