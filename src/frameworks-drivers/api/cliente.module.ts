import { Module } from "@nestjs/common";
import { ClienteController } from "./cliente.controller";
import { DataBaseModule } from "src/frameworks-drivers/data/database.module";
import { customerProviders } from "src/frameworks-drivers/data/repositories/customer.provider";
import { databaseProviders } from "src/frameworks-drivers/data/database.provider";
import { ClienteRepository } from "src/frameworks-drivers/data/repositories/cliente-repository";
import { IClienteRepository } from "src/domain/ports/cliente-repository.interface";
import { ClienteUseCase } from "src/domain/use-cases/cliente-use-case.service";
import { IClienteUseCase } from "src/domain/use-cases/cliente-use-case.interface";
import { IClienteGateway } from "src/domain/ports/cliente-gateway.interface";
import { ClienteGateway } from "src/interface-adapters/gateways/cliente.gateway";

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
      },
      ClienteGateway,
      {
        provide: IClienteGateway,
        useClass: ClienteGateway
      }
    ],
  })
  export class ClienteModule {}
  