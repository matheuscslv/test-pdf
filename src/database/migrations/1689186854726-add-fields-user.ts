import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addFieldsUser1689186854726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'busca_avancada_inrc');

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'busca_avancada_inrc', // ['Nenhuma', 'Basico', 'Avancado']
        type: 'varchar',
        length: '255',
        default: "'Nenhuma'",
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'profile_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    const foreignKey = new TableForeignKey({
      columnNames: ['profile_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'profiles',
      onDelete: 'SET NULL',
    });
    await queryRunner.createForeignKey('users', foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'profile_id');
    // await queryRunner.dropColumn('users', 'busca_avancada_inrc');
  }
}
