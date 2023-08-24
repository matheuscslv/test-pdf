import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldsPesquisaUser1689788974396 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'busca_avancada_inrc');

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'busca_avancada_civil',
        type: 'varchar',
        length: '255',
        isNullable: true,
        default: "'Nenhuma'", // ['Nenhuma', 'Basico', 'Avancado']
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'busca_avancada_criminal',
        type: 'varchar',
        length: '255',
        isNullable: true,
        default: "'Nenhuma'", // ['Nenhuma', 'Basico', 'Avancado']
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'busca_avancada_inrc',
        type: 'varchar',
        length: '255',
        isNullable: true,
        default: "'Nenhuma'", // ['Nenhuma', 'Basico', 'Avancado']
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'busca_avancada_prisional',
        type: 'varchar',
        length: '255',
        isNullable: true,
        default: "'Nenhuma'", // ['Nenhuma', 'Basico', 'Avancado']
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'busca_avancada_civil');
    await queryRunner.dropColumn('users', 'busca_avancada_criminal');
    await queryRunner.dropColumn('users', 'busca_avancada_inrc');
    await queryRunner.dropColumn('users', 'busca_avancada_prisional');
  }
}
