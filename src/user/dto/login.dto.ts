import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    format: 'email',
    required: true,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    format: 'password',
    required: true,
    minLength: 8,
  })
  @IsString()
  password: string;
}
