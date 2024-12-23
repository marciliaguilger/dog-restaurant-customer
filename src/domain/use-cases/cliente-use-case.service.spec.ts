import { TestingModule, Test } from "@nestjs/testing";
import { Cliente } from "../entities/cliente.entity";
import { ClienteUseCase } from "./cliente-use-case.service";
import { IClienteGateway } from "../ports/cliente-gateway.interface";

describe('ClienteUseCase', () => {
    let service: ClienteUseCase;
    let mockClienteGateway: Partial<IClienteGateway>;
    const nomeMocked = 'some-name';
    const cpfMocked = '99999999999';
    const emailMocked = 'email@teste.com'
  
    beforeEach(async () => {
      mockClienteGateway = {
        getByCpf: jest.fn().mockImplementation((cpf: string) => {
            cpf = '99999999999';
            const cliente = new Cliente(nomeMocked, cpf, emailMocked);
            return Promise.resolve(cliente);
        }),
        getAll: jest.fn().mockImplementation(() => {
            const cliente1 = new Cliente(nomeMocked, cpfMocked, emailMocked);
            const cliente2 = new Cliente(nomeMocked, cpfMocked, emailMocked);
          return Promise.resolve([cliente1, cliente2]);
        }),
        create: jest.fn().mockImplementation((cliente: Cliente) => {
          return Promise.resolve();
        })
      };
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ClienteUseCase,
          {
            provide: IClienteGateway,
            useValue: mockClienteGateway
          },
        ],
      }).compile();
  
      service = module.get<ClienteUseCase>(ClienteUseCase);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    it('should return a cliente by CPF', async () => {      
      const cliente = await service.getByCpf(cpfMocked);
      expect(cliente).toBeDefined();
      expect(cliente.cpf.numero).toBe(cpfMocked);
      expect(mockClienteGateway.getByCpf).toHaveBeenCalledWith(cpfMocked);
    });
  
    it('should return all clientes', async () => {
      const clientes = await service.getAll();
      expect(clientes).toHaveLength(2);
      expect(mockClienteGateway.getAll).toHaveBeenCalled();
    });
  });