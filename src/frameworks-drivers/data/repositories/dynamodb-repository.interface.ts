import { AttributeValue, PutItemInputAttributeMap } from "aws-sdk/clients/dynamodb";
import { Item } from "aws-sdk/clients/simpledb";

export interface IDynamoDbRepository {
    create(item: PutItemInputAttributeMap): Promise<void> 
    read(id: string): Promise<Item | null>
    scan(): Promise<Record<string, AttributeValue>[] | null>
    update(id: string, attributes: Partial<Item>): Promise<void>
    queryClienteByDocumento(documento: string):  Promise<Record<string, AttributeValue>> 
}

export const IDynamoDbRepository = Symbol('IDynamoDbRepository')