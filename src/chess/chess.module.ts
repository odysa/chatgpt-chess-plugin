import { Module } from '@nestjs/common';
import { ChessService } from './chess.service';
import { ChessController } from './chess.controller';
import { SupabaseModule } from 'src/supabase';

@Module({
  imports: [SupabaseModule],
  controllers: [ChessController],
  providers: [ChessService],
})
export class ChessModule {}
