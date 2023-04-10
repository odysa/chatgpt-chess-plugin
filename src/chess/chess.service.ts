import { Injectable } from '@nestjs/common';
import { Supabase } from 'src/supabase';
import { ChessGame, Game } from './entities/chess.entity';

@Injectable()
export class ChessService {
  constructor(private readonly supabase: Supabase) {}

  async getChess(id: string): Promise<ChessGame> {
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

  async insertChess(chess: ChessGame): Promise<string> {
    const { data, error } = await this.supabase
      .getClient()
      .from('games')
      .insert<Game>(chess.toGame())
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
