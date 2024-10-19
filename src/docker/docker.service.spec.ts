import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DockerService } from './docker.service';
import { Container } from '../database/container.entity';
import * as net from 'net';

jest.mock('net');

describe('DockerService', () => {
  let service: DockerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DockerService,
        {
          provide: getRepositoryToken(Container),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DockerService>(DockerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFreePortsNear', () => {
    it('should return 5 free ports', async () => {
      const mockServer = {
        listen: jest.fn((port, callback) => callback()),
        close: jest.fn((callback) => callback()),
        on: jest.fn(),
      };
      (net.createServer as jest.Mock).mockReturnValue(mockServer);

      const result = await service.getFreePortsNear(3000);
      expect(result).toHaveLength(5);
      expect(result[0]).toBe(3000);
      expect(mockServer.listen).toHaveBeenCalledTimes(5);
      expect(mockServer.close).toHaveBeenCalledTimes(5);
    });

    it('should skip occupied ports', async () => {
      const mockServer = {
        listen: jest.fn((port, callback) => {
          if (port === 3001) {
            mockServer.on.mock.calls[0][1](); // Trigger error for port 3001
          } else {
            callback();
          }
        }),
        close: jest.fn((callback) => callback()),
        on: jest.fn(),
      };
      (net.createServer as jest.Mock).mockReturnValue(mockServer);

      const result = await service.getFreePortsNear(3000);
      expect(result).toHaveLength(5);
      expect(result).toEqual([3000, 3002, 3003, 3004, 3005]);
    });
  });
});