import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('relatories')
class Relatory {
  @PrimaryColumn()
  id: string;

  @Column()
  nome!: string;

  @Column()
  campos?: string;

  @Column()
  user_id!: string;

  @Column()
  institution_id!: string;

  @Column()
  deleted!: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  constructor() {
    // @ts-ignore
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export default Relatory;
