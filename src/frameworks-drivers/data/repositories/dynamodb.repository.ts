import { Item } from "aws-sdk/clients/simpledb";
import { IDynamoDbRepository } from "./dynamodb-repository.interface";
import { PutItemInputAttributeMap } from "aws-sdk/clients/dynamodb";
import { AttributeValue, DynamoDBClient, ListTablesCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";


export class DynamoDbRepository implements IDynamoDbRepository{
  
  private readonly tableName = "clientes";
  private readonly dynamoDb: DynamoDBDocumentClient;

  constructor() {
    console.log('Inicializando configuração do DynamoDB com IRSA');
    
    console.log('Região configurada:', process.env.AWS_REGION);
    console.log('ARN da função IAM:', process.env.AWS_ROLE_ARN);
    console.log('Caminho do arquivo de token:', process.env.AWS_WEB_IDENTITY_TOKEN_FILE);

    const client = new DynamoDBClient({});
    this.dynamoDb = DynamoDBDocumentClient.from(client);
    this.testConnection();
  }  
  
    async testConnection() {
      const params = {
        TableName: this.tableName,
      };
      try {
        const data = await this.dynamoDb.send(new ScanCommand(params));
        console.log("Scan de itens:", data.Items);
      } catch (error) {
        console.error('Erro ao conectar ao DynamoDB:', error);
      }
    }

    async create(item: PutItemInputAttributeMap): Promise<void> {
      console.log('create method called')
      try {
        const command = new PutCommand({
          TableName: this.tableName,
          Item: item,
        });
        await this.dynamoDb.send(command);
      } catch (error) {
        console.error('Erro ao inserir dados:', error);
      }
    }
 
    async read(documento: string): Promise<Item | null> {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { documento },
      });
      const result = await this.dynamoDb.send(command);
      return result.Item as Item || null;
    }

    async queryClienteByDocumento(documento: string): Promise<Record<string, AttributeValue>> {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: "documento-index",
        KeyConditionExpression: "#documento = :documento",
        ExpressionAttributeNames: {
          "#documento": "documento"
        },
        ExpressionAttributeValues: {
          ":documento": { S: documento }
        }
      });
    
      try {
        const result = await this.dynamoDb.send(command);
        return result.Items[0] || undefined;
      } catch (error) {
        console.error("Error querying DynamoDB:", error);
        return undefined;
      }
    }

    async scan(): Promise<Record<string, AttributeValue>[] | null> {
      const command = new ScanCommand({
        TableName: this.tableName,
      });
      const result = await this.dynamoDb.send(command);
      return result.Items || null;
    }

    async update(id: string, attributes: Partial<Item>): Promise<void> {
      const updateExpression = 'set ' + Object.keys(attributes).map((key, index) => `#${key} = :val${index}`).join(', ');
      const expressionAttributeNames = Object.keys(attributes).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
      const expressionAttributeValues = Object.values(attributes).reduce((acc, val, index) => ({ ...acc, [`:val${index}`]: val }), {});
  
      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      });
      await this.dynamoDb.send(command);
    }
  }