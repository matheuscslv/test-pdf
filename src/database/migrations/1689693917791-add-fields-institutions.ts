import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addFieldsInstitutions1689693917791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'institutions',
      new TableColumn({
        name: 'sigla',
        type: 'varchar',
        length: '255',
        isNullable: false,
        default: "'SIGLA'",
      })
    );
    await queryRunner.addColumn(
      'institutions',
      new TableColumn({
        name: 'site',
        type: 'varchar',
        length: '255',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'institutions',
      new TableColumn({
        name: 'descricao',
        type: 'text',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
