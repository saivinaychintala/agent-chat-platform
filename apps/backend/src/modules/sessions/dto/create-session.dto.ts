import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  agentId: string;

  @ApiPropertyOptional({ example: 'Support chat for order #1234' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;
}
