import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AgentConfigDto {
  @ApiPropertyOptional({ example: 'gpt-4', default: 'gpt-4' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ example: 0.7, minimum: 0, maximum: 2, default: 0.7 })
  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional({
    example: 'You are a helpful AI assistant.',
    default: 'You are a helpful AI assistant.',
  })
  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @ApiPropertyOptional({ example: 1000, default: 1000 })
  @IsNumber()
  @IsOptional()
  maxTokens?: number;
}

export class CreateAgentDto {
  @ApiProperty({ example: 'Customer Support Agent' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Helps with customer inquiries and support tickets' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ type: AgentConfigDto })
  @ValidateNested()
  @Type(() => AgentConfigDto)
  @IsOptional()
  config?: AgentConfigDto;
}
