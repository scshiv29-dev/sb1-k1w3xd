import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Container } from '../database/container.entity';
import * as net from 'net';

const database_configs = {
  // ... (keep existing configs)
};

@Injectable()
export class DockerService {
  private docker: Docker;

  constructor(
    @InjectRepository(Container)
    private containerRepository: Repository<Container>,
  ) {
    this.docker = new Docker();
  }

  // ... (keep existing methods)

  async getFreePortsNear(internalPort: number): Promise<number[]> {
    const freePorts: number[] = [];
    let currentPort = internalPort;

    while (freePorts.length < 5) {
      if (await this.isPortFree(currentPort)) {
        freePorts.push(currentPort);
      }
      currentPort++;
    }

    return freePorts;
  }

  private isPortFree(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.close(() => resolve(true));
      });
      server.on('error', () => resolve(false));
    });
  }
}