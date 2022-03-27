/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary:
      'Recebe um JSON com email e senha, retorna email e token caso autentique.',
  })
  @Post()
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Recebe um token JWT(Bearer), retorna true caso logado',
  })
  @Get()
  @UseGuards(AuthGuard())
  async checkLogin() {
    return true;
  }
}
