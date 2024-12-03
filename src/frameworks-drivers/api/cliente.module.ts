import { Module } from "@nestjs/common";
import { ClienteController } from "./cliente.controller";
import { ClienteRepository } from "src/frameworks-drivers/data/repositories/cliente-repository";
import { IClienteRepository } from "src/domain/ports/cliente-repository.interface";
import { ClienteUseCase } from "src/domain/use-cases/cliente-use-case.service";
import { IClienteUseCase } from "src/domain/use-cases/cliente-use-case.interface";
import { IClienteGateway } from "src/domain/ports/cliente-gateway.interface";
import { ClienteGateway } from "src/interface-adapters/gateways/cliente.gateway";
import { DynamoDbRepository } from "../data/repositories/dynamodb.repository";
import { IDynamoDbRepository } from "../data/repositories/dynamodb-repository.interface";

@Module({
    imports: [],
    controllers: [ClienteController],
    providers: [
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
      },
      DynamoDbRepository,
      {
          provide: IDynamoDbRepository,
          useClass: DynamoDbRepository,
      }
    ],
  })
  export class ClienteModule {}
  