import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  create(@Request() req, @Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(req.user.userId, createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user sessions' })
  @ApiResponse({ status: 200, description: 'List of sessions' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'closed', 'archived'] })
  @ApiQuery({ name: 'agentId', required: false })
  findAll(
    @Request() req,
    @Query('status') status?: string,
    @Query('agentId') agentId?: string,
  ) {
    return this.sessionsService.findAll(req.user.userId, { status, agentId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by ID' })
  @ApiResponse({ status: 200, description: 'Session details' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.sessionsService.findOne(id, req.user.userId);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close a session' })
  @ApiResponse({ status: 200, description: 'Session closed successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  close(@Param('id') id: string, @Request() req) {
    return this.sessionsService.close(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete session' })
  @ApiResponse({ status: 200, description: 'Session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.sessionsService.remove(id, req.user.userId);
  }
}
