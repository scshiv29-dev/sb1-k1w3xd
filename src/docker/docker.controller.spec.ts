import { Test, TestingModule } from '@nestjs/testing';
import { DockerController } from './docker.controller';
import { DockerService } from './docker.service';

describe('DockerController', () => {
  let controller: DockerController;
  let service: DockerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DockerController],
      providers: [
        {
          provide: DockerService,
          useValue: {
            getFreePortsNear: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DockerController>(DockerController);
    service = module.get<DockerService>(DockerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFreePorts', () => {
    it('should return an array of free ports', async () => {
      const mockPorts = [3000, 3001, 3002, 3003, 3004];
      (service.getFreePortsNear as jest.Mock).mockResolvedValue(mockPorts);

      const result = await controller.getFreePorts('3000');
      expect(result).toEqual(mockPorts);
      expect(service.getFreePortsNear).toHaveBeenCalledWith(3000);
    });

    it('should throw an error for invalid port', async () => {
      await expect(controller.getFreePorts('invalid')).rejects.toThrow('Invalid internal port');
    });
  });
});