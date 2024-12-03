import { Inject, Injectable } from "@nestjs/common";
import { IClienteRepository } from "src/domain/ports/cliente-repository.interface";
import { Cliente } from "src/domain/entities/cliente.entity";
import { IDynamoDbRepository } from "./dynamodb-repository.interface";
import { ClienteModel } from "src/interface-adapters/gateways/db-model/cliente.model";
import { DynamoDB } from "aws-sdk";

@Injectable()
export class ClienteRepository implements IClienteRepository  {
    constructor(
        @Inject(IDynamoDbRepository)
        private readonly db: IDynamoDbRepository,
    ){}
    
    async getAll(): Promise<Cliente[]> {
        const items = await this.db.scan()
        const clientes = convertDynamoListItemToListModel(items)
        const response: Cliente[] = [];
        
        clientes.forEach(c => {
            response.push(new Cliente(c.nome, c.documento, c.email))
        })
        return response
    }
    
    async getByCpf(cpf: string): Promise<Cliente | undefined> {
        const item = await this.db.queryClienteByDocumento(cpf)
        console.log(item)
        
        if (item === null || item === undefined) return undefined;
        const customerData = convertDynamoItemToModel(item)
        
        if (customerData === null) return undefined;
        const customer = new Cliente(
            customerData.nome,
            customerData.documento, 
            customerData.email);

        return customer
    }
    
    create(customer: Cliente) {
        const item = convertClienteModelToDynamoItem(customer)
        console.log(item)
        this.db.create(item)
    }
}

const convertClienteModelToDynamoItem = (cliente: Cliente): DynamoDB.DocumentClient.PutItemInputAttributeMap => {
    return {
        id: cliente.id,
        nome: cliente.nome,
        documento: cliente.cpf.numero,
        email: cliente.email
    };
};

const convertDynamoItemToModel = (dynamoItem: Record<string, DynamoDB.AttributeValue>): ClienteModel => {
    return {
        nome: dynamoItem['nome']?.S || '',
        id: dynamoItem['id']?.S || '',
        documento: dynamoItem['documento']?.S || '',
        email: dynamoItem['email']?.S || '',
    }
};

const convertDynamoListItemToListModel = (items: Record<string, DynamoDB.AttributeValue>[]): ClienteModel[] => {
    
    const mappedResults: ClienteModel[] = items.map(item => ({
      id: item.Attributes['id'],
      nome: item.Attributes['nome'],
      documento: item.Attributes['documento'],
      email: item.Attributes['email']
    }));

    return mappedResults;
};