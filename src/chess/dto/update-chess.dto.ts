import { PartialType } from '@nestjs/mapped-types';
import { CreateChessDto } from './create-chess.dto';
import { ChessMove } from '../entities/chess.entity';

export class UpdateChessDto extends PartialType(CreateChessDto) {
  move: ChessMove;
}
