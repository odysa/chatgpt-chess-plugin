import { PartialType } from '@nestjs/mapped-types';
import { CreateChessDto } from './create-chess.dto';
import { ChessMove } from '../entities/chess.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChessDto extends PartialType(CreateChessDto) {
  @ApiProperty()
  move: ChessMove;
}
