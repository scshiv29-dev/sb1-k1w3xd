import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'ADMIN_USERNAME') return 'admin';
              if (key === 'ADMIN_PASSWORD') return 'hashed_password';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object if credentials are valid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.validateUser('admin', 'password');
      expect(result).toEqual({ username: 'admin' });
    });

    it('should return null if credentials are invalid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await service.validateUser('admin', 'wrong_password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const result = await service.login({ username: 'admin' });
      expect(result).toEqual({ access_token: 'test_token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'admin', sub: undefined });
    });
  });
});