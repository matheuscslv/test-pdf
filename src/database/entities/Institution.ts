import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('institutions')
class Institution {
  @PrimaryColumn()
  id: string;

  @Column()
  nome!: string;

  @Column()
  sigla!: string;

  @Column()
  site?: string;

  @Column()
  descricao?: string;

  @Column()
  status!: boolean;

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

export default Institution;
