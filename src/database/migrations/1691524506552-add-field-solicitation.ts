import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldSolicitation1691524506552 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'solicitations',
      new TableColumn({
        name: 'observacao',
        type: 'text',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('solicitations', 'observacao');
  }
}
