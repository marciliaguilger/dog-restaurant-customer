import { MigrationInterface, QueryRunner } from "typeorm";

export class Customer1728338095339 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE Clientes (
                ClienteId varchar(40) NOT NULL,
                ClienteNome varchar(100) NOT NULL,
                ClienteDocumento varchar(50) NOT NULL,
                TipoDocumento varchar(10) NOT NULL,
                Email varchar(100) NOT NULL,
                CONSTRAINT PK_Customer PRIMARY KEY (ClienteId)
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE Clientes`
        );
    }
}
