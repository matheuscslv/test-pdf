import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addFieldsUser1689505674924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'institution_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    const foreignKey = new TableForeignKey({
      columnNames: ['institution_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'institutions',
      onDelete: 'SET NULL',
    });
    await queryRunner.createForeignKey('users', foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'institution_id');
  }
}
