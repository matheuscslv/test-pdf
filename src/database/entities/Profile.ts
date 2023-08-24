import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('profiles')
class Profile {
  @PrimaryColumn()
  id: string;

  @Column()
  nome!: string;

  @Column()
  perfil_pesquisa!: string;

  @Column()
  perfil_inrc!: string;

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

export default Profile;
