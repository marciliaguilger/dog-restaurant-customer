import { Module } from "@nestjs/common";
import { ClienteController } from "./controller/cliente.controller";
import { DataBaseModule } from "src/infrastructure/database.module";
import { customerProviders } from "src/infrastructure/repositories/customer.provider";
import { databaseProviders } from "src/infrastructure/database.provider";
import { ClienteRepository } from "src/infrastructure/repositories/cliente-repository";
import { IClienteRepository } from "src/domain/repositories/cliente-repository.interface";
import { ClienteUseCase } from "src/domain/use-cases/cliente-use-case.service";
import { IClienteUseCase } from "src/domain/use-cases/cliente-use-case.interface";

@Module({
    imports: [DataBaseModule],
    controllers: [ClienteController],
    providers: [
      ... customerProviders,
      ... databaseProviders,
      ClienteRepository,
      {
        provide: IClienteRepository,
        useClass: ClienteRepository
      },
      ClienteUseCase,
      {
        provide: IClienteUseCase,
        useClass: ClienteUseCase
      }
    ],
  })
  export class ClienteModule {}
  