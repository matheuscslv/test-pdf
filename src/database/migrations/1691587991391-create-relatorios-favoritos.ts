import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createRelatoriosFavoritos1691587991391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'relatories_favs',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'relatory_id',
                        type: 'uuid',
                        isNullable: false,
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
                        name: 'User',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['user_id'],
                        onDelete: 'SET NULL',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'Relatory',
                        referencedTableName: 'relatories',
                        referencedColumnNames: ['id'],
                        columnNames: ['relatory_id'],
                        onDelete: 'SET NULL',
                        onUpdate: 'CASCADE',
                    },
                ],
            })
        );    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('relatories_favs');
    }

}
