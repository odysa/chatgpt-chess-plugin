import { Injectable } from '@nestjs/common';
import { Supabase } from 'src/supabase';
import { ChessGame, ChessStatus, ChessWinner } from './entities/chess.entity';

type Game = {
  id?: number;
  status: ChessStatus;
  winner?: ChessWinner;
  fen: string;
};

@Injectable()
export class ChessService {
  constructor(private readonly supabase: Supabase) {}

  async getChess(id: number): Promise<ChessGame> {
    const { data, error } = await this.supabase
      .getClient()
      .from('games')
      .select()
      .match({ id })
      .single<Game>();

    if (error) {
      return null;
    }

    return ChessGame.fromGame(data);
  }

  async insertChess(chess: ChessGame): Promise<number> {
    const { data, error } = await this.supabase
      .getClient()
      .from('games')
      .insert<Game>({
        status: chess.status(),
        fen: chess.fen(),
      })
      .select()
      .single<Game>();

    if (error) {
      throw error;
    }

    return data.id;
  }

  async updateChess(chess: ChessGame) {
    const { error } = await this.supabase
      .getClient()
      .from('games')
      .update<Game>(chess.toGame());
    if (error) {
      throw error;
    }
  }
}
