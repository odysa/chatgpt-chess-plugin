import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ChessService } from './chess.service';
import { CreateChessDto } from './dto/create-chess.dto';
import { UpdateChessDto } from './dto/update-chess.dto';
import { ChessGame } from './entities/chess.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@Controller('chess')
export class ChessController {
  constructor(private readonly chessService: ChessService) {}

  @Post()
  @ApiTags('Chess')
  @ApiOperation({
    summary: 'create a new chess game or get a existing game by id',
    description:
      'create a new chess game and return given id. If the gameId is provided, retrieve the existing game',
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
    return id;
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

  @Patch(':id')
  @ApiTags('Chess')
  @ApiOperation({
    summary: 'move chess of given id in path',
    description: 'get the game of id, and move chess.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateChessDto: UpdateChessDto,
  ) {
    const { move } = updateChessDto;
    const game = await this.chessService.getChess(id);
    if (game == null) {
      return 'Game not found';
    }
    try {
      game.move(move);
    } catch {
      return 'Your move is not valid';
    }
    await this.chessService.updateChess(game);
  }
}
