import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterFieldsUser1689115485422 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'busca_completa');

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'emite_folha_antecedentes', // ['T', 'F']
        type: 'char',
        length: '1',
        default: "'F'",
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'busca_avancada', // ['T', 'F']
        type: 'char',
        length: '1',
        default: "'F'",
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'busca_avancada_inrc', // ['T', 'F']
        type: 'char',
        length: '1',
        default: "'F'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'emite_folha_antecedentes');
    await queryRunner.dropColumn('users', 'busca_avancada');
    // await queryRunner.dropColumn('users', 'busca_avancada_inrc');
  }
}
