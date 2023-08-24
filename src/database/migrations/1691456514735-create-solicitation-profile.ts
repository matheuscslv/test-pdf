import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createSolicitationProfile1691456514735
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'solicitations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'request_fac', // ['T', 'F']
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'request_busca_avancada', // ['Basico', 'Avancado']
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'request_busca_avancada_civil', // ['Nenhuma', 'Basico', 'Avancado']
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'request_busca_avancada_criminal', // ['Nenhuma', 'Basico', 'Avancado']
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'request_busca_avancada_inrc', // ['Nenhuma', 'Basico', 'Avancado']
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'request_busca_avancada_prisional', // ['Nenhuma', 'Basico', 'Avancado']
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'status', // ['Aguardando', 'Aceito', 'Negado']
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'data_solicitacao',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'data_resposta_solicitacao',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'user_solicitation_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_response_solicitation_id',
            type: 'uuid',
            isNullable: true,
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
        foreignKeys: [
          {
            name: 'UserSolicitation',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_solicitation_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UserAcceptSolicitation',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_response_solicitation_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('solicitations');
  }
}
