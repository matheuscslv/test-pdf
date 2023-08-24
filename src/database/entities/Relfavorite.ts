import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('relatories_favs')
class Relfavorite {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id!: string;

  @Column()
  relatory_id!: string;

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

export default Relfavorite;
