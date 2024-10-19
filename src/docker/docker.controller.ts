import { Controller, Post, Get, Delete, Body, Param, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DockerService } from './docker.service';
import { Response } from 'express';

@Controller('docker')
@UseGuards(AuthGuard('jwt'))
export class DockerController {
  constructor(private dockerService: DockerService) {}

  // ... (keep existing methods)

  @Get('get-free-ports/:internalPort')
  async getFreePorts(@Param('internalPort') internalPort: string) {
    const port = parseInt(internalPort, 10);
    if (isNaN(port)) {
      throw new Error('Invalid internal port');
    }
    return this.dockerService.getFreePortsNear(port);
  }

  // ... (keep existing methods)
}