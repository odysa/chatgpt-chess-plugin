import { Chess as RawChess } from 'chess.js';
import { v4 as uuid } from 'uuid';

export type ChessMove = { from: string; to: string; promotion?: string };
export type ChessStatus = 'INIT' | 'PLAYING' | 'DONE';
export type ChessWinner = 'AI' | 'USER';

// Game is the schema in database
export type Game = {
  id?: string;
  status: ChessStatus;
  winner?: ChessWinner;
  fen: string;
};

export class ChessGame {
  private _id: string;
  private chess: RawChess;
  private _status: ChessStatus;
  private _winner: ChessWinner;

  public static fromGame(game: Game): ChessGame {
    const raw = new RawChess(game.fen);
    return new ChessGame(game.id, raw, game.status);
  }

  public static default(): ChessGame {
    return new ChessGame(uuid(), new RawChess(), 'INIT');
  }

  constructor(id: string, chess: RawChess, status: ChessStatus) {
    this._id = id;
    this.chess = chess;
    this._status = status;
  }

  public move(m: ChessMove) {
    this.chess.move(m);
  }

  public status(): ChessStatus {
    return this._status;
  }

  public setId(id: string) {
    this._id = id;
  }

  public id(): string {
    return this._id;
  }

  public pgn(): string {
    return this.chess.pgn();
  }

  public undoLastMove(): boolean {
    return this.chess.undo() != null;
  }

  public fen(): string {
    return this.chess.fen();
  }

  public toGame(): Game {
    return {
      id: this._id,
      fen: this.fen(),
      status: this._status,
      winner: this._winner,
    };
  }

  public toAscii(): string {
    return this.chess.ascii();
  }
}
