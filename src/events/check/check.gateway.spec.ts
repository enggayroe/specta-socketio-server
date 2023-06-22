import { Test, TestingModule } from '@nestjs/testing';
import { CheckGateway } from './check.gateway';

describe('CheckGateway', () => {
  let gateway: CheckGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckGateway],
    }).compile();

    gateway = module.get<CheckGateway>(CheckGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
