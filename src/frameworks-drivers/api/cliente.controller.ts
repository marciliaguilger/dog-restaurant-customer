import { Body, Controller, Get, Inject, NotFoundException, Param, Post } from "@nestjs/common";
import { CreateClienteInput as CreateClienteInput } from "../../interface-adapters/presenters/input/create-cliente-input";
import { CustomerOutput as ClienteOutput } from "../../interface-adapters/presenters/output/cliente-output";
import { ApiTags } from "@nestjs/swagger";
import { IClienteUseCase } from "../../domain/use-cases/cliente-use-case.interface";
import { Cliente } from "../../domain/entities/cliente.entity";

@ApiTags('Cliente')
@Controller('clientes')
export class ClienteController {
  constructor(
    @Inject(IClienteUseCase)
    private readonly clienteUseCase: IClienteUseCase) {}

  @Post()
  async createCliente(@Body() createClienteInput: CreateClienteInput) {
    const cliente = new Cliente(createClienteInput.nome,createClienteInput.documento ,createClienteInput.email);
    return {clienteId:  await this.clienteUseCase.create(cliente) };
  }

  @Get(':cpf')
  async getClienteByDocument(@Param('cpf') cpf: string): Promise<ClienteOutput > {
    const cliente = await this.clienteUseCase.getByCpf(cpf);
    if (!cliente) {
      throw new NotFoundException(`Cliente com o documento: ${document} não encontrado`);
    }
    return new ClienteOutput(cliente.id, cliente.nome, cliente.cpf.numero, cliente.email);
  }

  @Get()
  async getAll(): Promise<ClienteOutput[]> {
    const cliente = await this.clienteUseCase.getAll();
    
    return cliente.map(cliente => new ClienteOutput(cliente.id, cliente.nome, cliente.cpf.numero, cliente.email));
  }
}