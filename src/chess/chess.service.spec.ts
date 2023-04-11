import { Test, TestingModule } from '@nestjs/testing';
import { ChessService } from './chess.service';

describe('ChessService', () => {
  let service: ChessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChessService],
    }).compile();

    service = module.get<ChessService>(ChessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
