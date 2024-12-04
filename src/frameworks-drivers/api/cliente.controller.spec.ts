import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { IClienteUseCase } from '../../domain/use-cases/cliente-use-case.interface';
import { CreateClienteInput } from '../../interface-adapters/presenters/input/create-cliente-input';
import { Cliente } from '../../domain/entities/cliente.entity';
import { NotFoundException } from '@nestjs/common';
import { CustomerOutput as ClienteOutput } from "../../interface-adapters/presenters/output/cliente-output";


describe('ClienteController', () => {
  let controller: ClienteController;
  let clienteUseCaseMock: jest.Mocked<IClienteUseCase>;

  beforeEach(async () => {
    clienteUseCaseMock = {
      create: jest.fn(),
      getByCpf: jest.fn(),
      getAll: jest.fn(),
    } as jest.Mocked<IClienteUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        {
          provide: IClienteUseCase,
          useValue: clienteUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<ClienteController>(ClienteController);
  });

  describe('createCliente', () => {
    it('should create a cliente and return its ID', async () => {
      const input: CreateClienteInput = {
        nome: 'John Doe',
        id: '1',
        documento: '11111111111',
        email: 'johndoe@example.com',
      };
      const cliente = new Cliente(input.nome, input.documento, input.email);

      clienteUseCaseMock.create.mockResolvedValue('1');

      const result = await controller.createCliente(input);

      expect(result.clienteId).toBe('1');
      expect(clienteUseCaseMock.create).toHaveBeenCalled();
    });
  });

  describe('getClienteByDocument', () => {
    it('should return a cliente by document', async () => {
      const cpf = '11111111111';
      const cliente = new Cliente('John Doe', cpf, 'johndoe@example.com');
      clienteUseCaseMock.getByCpf.mockResolvedValue(cliente);

      const result = await controller.getClienteByDocument(cpf);

      expect(result).toEqual(new ClienteOutput(cliente.id, cliente.nome, cliente.cpf.numero, cliente.email));
    });
  });

  describe('getAll', () => {
    it('should return an array of clientes', async () => {
      const clienteList = [
        new Cliente('John Doe', '11111111111', 'johndoe@example.com'),
        new Cliente('Jane Doe', '11111111111', 'janedoe@example.com'),
      ];
      clienteUseCaseMock.getAll.mockResolvedValue(clienteList);

      const result = await controller.getAll();

      expect(result).toEqual(
        clienteList.map(cliente => new ClienteOutput(cliente.id, cliente.nome, cliente.cpf.numero, cliente.email)),
      );
      expect(clienteUseCaseMock.getAll).toHaveBeenCalled();
    });
  });
});
