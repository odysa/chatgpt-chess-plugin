import { Chess as RawChess } from 'chess.js';

export type ChessMove = { from: string; to: string; promotion?: string };
export type ChessStatus = 'INIT' | 'PLAYING' | 'DONE';
export type ChessWinner = 'AI' | 'USER';

// Game is the schema in database
export type Game = {
  id?: number;
  status: ChessStatus;
  winner?: ChessWinner;
  fen: string;
};

export class Chess {
  private _id: number;
  private chess: RawChess;
  private _status: ChessStatus;
  private _winner: ChessWinner;

  public static fromGame(game: Game): Chess {
    const raw = new RawChess(game.fen);
    return new Chess(game.id, raw, game.status);
  }

  public static default(): Chess {
    return new Chess(-1, new RawChess(), 'INIT');
  }

  constructor(id: number, chess: RawChess, status: ChessStatus) {
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

  public setId(id: number) {
    this._id = id;
  }

  public id(): number {
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
}
