import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1659945311398 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'token',
            type: 'varchar',
            length: '2000',
            isNullable: true,
          },
          {
            name: 'senha',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'cpf',
            type: 'varchar',
            length: '14',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
