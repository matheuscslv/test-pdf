import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldHabilitadoUser1689788015109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'habilitado',
        type: 'varchar',
        length: '255',
        isNullable: true,
        default: "'T'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'habilitado');
  }
}
