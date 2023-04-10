import { Module } from '@nestjs/common';
import { ChessService } from './chess.service';
import { ChessController } from './chess.controller';

@Module({
  controllers: [ChessController],
  providers: [ChessService],
})
export class ChessModule {}
