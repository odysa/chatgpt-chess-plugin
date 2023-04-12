import { ApiProperty } from '@nestjs/swagger';

const LOCAL_HOST = 'http://localhost:3000/';
const PROD_HOST = 'https://chessmate.cc/';

export class UpdateResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  chessboard: string;

  public static success(id: string, steps: number): UpdateResponse {
    return new UpdateResponse(true, id, steps);
  }

  public static fail(id: string, steps: number): UpdateResponse {
    return new UpdateResponse(false, id, steps);
  }

  constructor(success: boolean, id: string, steps: number) {
    this.success = success;
    this.chessboard = `![picture](${this.getBaseUrl()}chess/board/${id}?steps=${steps})`;
  }

  private getBaseUrl(): string {
    if (process.env.MODE === 'prod') {
      return PROD_HOST;
    }
    return LOCAL_HOST;
  }
}
