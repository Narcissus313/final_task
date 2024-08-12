import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'otps' })
export class OtpEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  otp: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  email: string;
}
