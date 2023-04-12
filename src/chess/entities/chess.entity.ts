import { Chess as RawChess } from 'chess.js';
import { v4 as uuid } from 'uuid';

export type ChessMove = { from: string; to: string; promotion?: string };
export type ChessStatus = 'PLAYING' | 'DONE';
export type ChessWinner = 'AI' | 'USER';

// Game is the schema in database
export type Game = {
  id?: string;
  status: ChessStatus;
  winner?: ChessWinner;
  fen: string;
  steps: number;
};

export class ChessGame {
  private _id: string;
  private chess: RawChess;
  private _status: ChessStatus;
  private _winner: ChessWinner;
  private _steps: number;

  public static fromGame(game: Game): ChessGame {
    const raw = new RawChess(game.fen);
    return new ChessGame(game.id, raw, game.status, game.steps);
  }

  public static default(): ChessGame {
    return new ChessGame(uuid(), new RawChess(), 'PLAYING', 0);
  }

  constructor(id: string, chess: RawChess, status: ChessStatus, steps: number) {
    this._id = id;
    this.chess = chess;
    this._status = status;
    this._steps = steps;
  }

  public move(m: ChessMove) {
    this.chess.move(m);
    this._steps++;
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
    if (this.chess.undo() != null) {
      this._steps--;
      return true;
    }
    return false;
  }

  public fen(): string {
    return this.chess.fen();
  }

  public toGame(): Game {
    return {
      id: this.id(),
      fen: this.fen(),
      status: this.status(),
      winner: this._winner,
      steps: this._steps,
    };
  }

  public toAscii(): string {
    return this.chess.ascii();
  }

  public steps(): number {
    return this._steps;
  }
}
