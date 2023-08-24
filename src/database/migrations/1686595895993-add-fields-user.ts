import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldsUser1686595895993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'busca_completa', // ['T', 'F']
        type: 'char',
        length: '1',
        default: "'F'",
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'access_token',
        type: 'varchar',
        length: '2000',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropColumn('users', 'busca_completa');
    await queryRunner.dropColumn('users', 'access_token');
  }
}
