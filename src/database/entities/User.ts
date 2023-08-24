import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import Institution from './Institution';
import Profile from './Profile';

@Entity('users')
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  nome!: string;

  @Column()
  cpf!: string;

  @Column()
  senha!: string;

  @Column()
  email!: string;

  @Column()
  emite_folha_antecedentes!: string;

  @Column()
  busca_avancada!: string;

  @Column()
  busca_avancada_civil!: string;

  @Column()
  busca_avancada_criminal!: string;

  @Column()
  busca_avancada_inrc!: string;

  @Column()
  busca_avancada_prisional!: string;

  @Column()
  token!: string;

  @Column()
  access_token!: string;

  @Column()
  habilitado!: string;

  @Column()
  is_created_gov!: string;

  @Column()
  profile_id!: string;

  @Column()
  institution_id?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  perfil!: Profile;

  @ManyToOne(() => Institution)
  @JoinColumn({ name: 'institution_id' })
  instituicao!: Institution;

  constructor() {
    // @ts-ignore
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export default User;
