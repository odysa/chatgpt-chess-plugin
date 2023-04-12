import { Controller, Get, Post, Body, Patch, Param, Res } from '@nestjs/common';
import { ChessService } from './chess.service';
import { CreateChessDto } from './dto/create-chess.dto';
import { ChessGame } from './entities/chess.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as ChessImageGenerator from 'chess-image-generator';
import type { Response } from 'express';

@Controller('chess')
export class ChessController {
  constructor(private readonly chessService: ChessService) {}

  @Post()
  @ApiTags('Chess')
  @ApiOperation({
    summary: 'Create a new chess game or get a existing game by id',
    description:
      'Create a new chess game and return given id. If the gameId is provided, retrieve the existing game. Return the id and chessboard img',
  })
  async create(@Body() createChessDto: CreateChessDto) {
    // we should load game from db
    if (createChessDto?.gameId) {
      const { gameId } = createChessDto;
      const game = await this.chessService.getChess(gameId);
      if (game) {
        return game.toAscii();
      }
    }

    const chess = ChessGame.default();
    const id = await this.chessService.insertChess(chess);
    return {
      id: id,
      chessboard: `![picture](http://localhost:3000/chess/board/${id})`,
    };
  }

  @Get(':id')
  @ApiTags('Chess')
  @ApiOperation({
    summary: 'get a chess game ascii display',
    description:
      'The id is provided, retrieve the existing game, return the ascii chess board',
  })
  async findOne(@Param('id') id: string) {
    const game = await this.chessService.getChess(id);
    if (game) {
      return game.toAscii();
    } else {
      return 'Game not found';
    }
  }

  @Patch('/undo/:id')
  @ApiTags('Chess')
  @ApiOperation({
    summary: 'undo last move',
    description: 'undo last move of game id',
  })
  async undo(@Param('id') id: string) {
    const game = await this.chessService.getChess(id);
    if (game == null) {
      return 'Game not found';
    }

    return game.undoLastMove();
  }

  @Get('/move/:id/:from/:to')
  @ApiTags('Chess')
  @ApiOperation({
    summary: 'move chess of given id in path',
    description:
      'Get the gameId, and move chess. Parameter id is game id, from is original place, and to is destination',
  })
  async update(
    @Param('id') id: string,
    @Param('from') from: string,
    @Param('to') to: string,
  ) {
    const game = await this.chessService.getChess(id);
    if (game == null) {
      return 'Game not found';
    }
    try {
      game.move({ from, to });
    } catch {
      return 'Your move is not valid';
    }
    await this.chessService.updateChess(game);
  }

  @Get('/board/:id')
  async board(@Param('id') id: string, @Res() res: Response) {
    const game = await this.chessService.getChess(id);
    if (game == null) {
      return 'Game not found';
    }

    const ig = new ChessImageGenerator();
    ig.loadFEN(game.fen());
    const buffer = await ig.generateBuffer();
    res.set({
      'Content-Type': 'image/png',
    });
    res.send(buffer);
    return;
  }
}
