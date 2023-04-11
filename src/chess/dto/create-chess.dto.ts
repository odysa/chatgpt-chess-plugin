import { ApiProperty } from '@nestjs/swagger';
export class CreateChessDto {
  @ApiProperty()
  gameId?: string;
}
