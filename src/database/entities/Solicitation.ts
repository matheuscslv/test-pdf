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

import User from './User';

@Entity('solicitations')
class Solicitation {
  @PrimaryColumn()
  id: string;

  @Column()
  request_fac!: string;

  @Column()
  request_busca_avancada!: string;

  @Column()
  request_busca_avancada_civil!: string;

  @Column()
  request_busca_avancada_criminal!: string;

  @Column()
  request_busca_avancada_inrc!: string;

  @Column()
  request_busca_avancada_prisional!: string;

  @Column()
  status!: string;

  @Column()
  data_solicitacao!: string;

  @Column()
  data_resposta_solicitacao!: string;

  @Column()
  user_solicitation_id!: string;

  @Column()
  user_response_solicitation_id!: string;

  @Column()
  observacao!: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_solicitation_id' })
  usuario_solicitacao!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_response_solicitation_id' })
  usuario_resposta_solicitacao!: User;

  constructor() {
    // @ts-ignore
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export default Solicitation;
