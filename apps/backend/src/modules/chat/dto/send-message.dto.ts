import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'Hello, how can you help me?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
}
