import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import Profile from './Profile';
import User from './User';

@Entity('users_profiles')
class UserProfile {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id!: string;

  @Column()
  profile_id!: string;

  @ManyToMany(() => Profile)
  @JoinColumn({ name: 'user_id' })
  perfil!: Profile;

  @ManyToMany(() => User)
  @JoinColumn({ name: 'profile_id' })
  usuario!: User;

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

export default UserProfile;
