import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableUnique,
  TableForeignKey,
} from 'typeorm';

export class User1687286814360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['ADMIN', 'BOSS', 'USER'],
            isNullable: false,
          },
          {
            name: 'bossId',
            type: 'integer',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createUniqueConstraint(
      'user',
      new TableUnique({
        name: 'UQ_user_email',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        name: 'FK_user_bossId',
        columnNames: ['bossId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('user', 'FK_user_bossId');
    await queryRunner.dropUniqueConstraint('user', 'UQ_user_email');
    await queryRunner.dropTable('user');
  }
}
