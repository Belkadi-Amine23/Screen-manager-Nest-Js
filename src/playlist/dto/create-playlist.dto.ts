import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePlaylistDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  name: string;
}
