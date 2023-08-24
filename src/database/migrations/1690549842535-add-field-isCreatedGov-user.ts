import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldIsCreatedGovUser1690549842535
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'is_created_gov',
        type: 'varchar',
        length: '255',
        isNullable: true,
        default: "'F'", // ['F', 'T']
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'is_created_gov');
  }
}
