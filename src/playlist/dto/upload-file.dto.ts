import { ParseIntPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
  @ApiProperty({
    description: 'The playlist to which the file will be uploaded',
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  playlistId: number;
}
