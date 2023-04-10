import { Injectable } from '@nestjs/common';
import { Supabase } from 'src/supabase';
import { Chess, ChessStatus, ChessWinner } from './entities/chess.entity';

type Game = {
  id?: number;
  status: ChessStatus;
  winner?: ChessWinner;
  fen: string;
};

@Injectable()
export class ChessService {
  constructor(private readonly supabase: Supabase) {}

  async getChess(id: number): Promise<Chess> {
    const { data, error } = await this.supabase
      .getClient()
      .from('games')
      .select()
      .match({ id })
      .single<Game>();

    if (error) {
      return null;
    }

    return Chess.fromGame(data);
  }

  async insertChess(chess: Chess): Promise<number> {
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

  async updateChess(chess: Chess) {
    const { error } = await this.supabase
      .getClient()
      .from('games')
      .update<Game>(chess.toGame());
    if (error) {
      throw error;
    }
  }
}
