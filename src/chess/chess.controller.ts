import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ChessService } from './chess.service';
import { CreateChessDto } from './dto/create-chess.dto';
import { UpdateChessDto } from './dto/update-chess.dto';
import { ChessGame } from './entities/chess.entity';

@Controller('chess')
export class ChessController {
  constructor(private readonly chessService: ChessService) {}

  @Post()
  async create(@Body() createChessDto: CreateChessDto) {
    // we should load game from db
    if (createChessDto?.gameId) {
      const { gameId } = createChessDto;
      const game = await this.chessService.getChess(gameId);
      if (game) {
        return game.status();
      }
    }

    const chess = ChessGame.default();
    const id = await this.chessService.insertChess(chess);
    chess.setId(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const game = await this.chessService.getChess(id);
    if (game) {
      return game.status();
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChessDto: UpdateChessDto,
  ) {
    const { gameId, move } = updateChessDto;
    const game = await this.chessService.getChess(gameId);
    game.move(move);
  }
}
