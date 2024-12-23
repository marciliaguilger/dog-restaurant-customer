import { Inject } from "@nestjs/common";
import { Cliente } from "src/domain/entities/cliente.entity";
import { IClienteGateway } from "src/domain/ports/cliente-gateway.interface";
import { IClienteRepository } from "src/domain/ports/cliente-repository.interface";

export class ClienteGateway implements IClienteGateway{
    constructor(
        @Inject(IClienteRepository)
        private readonly clienteRepository: IClienteRepository

    ){}

    create(customer: Cliente) {
        this.clienteRepository.create(customer)
    }
    getByCpf(cpf: string): Promise<Cliente> {
        return this.clienteRepository.getByCpf(cpf)
    }
    getAll(): Promise<Cliente[]> {
        return this.clienteRepository.getAll()
    }
}