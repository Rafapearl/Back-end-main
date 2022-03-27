/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { AuthGuard } from '@nestjs/passport';
import { Usuarios } from '@prisma/client';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
@ApiTags('usuario')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @UseGuards(AuthGuard('jwt'))
  
  @Post()
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Request() req,
  ): Promise<Usuarios> {
    if (!req.user.administrador) {
      throw new BadRequestException(
        'Somente usuários que são administradores podem cadastrar novos usuarios.',
      );
    }
    const usuario = await this.usuarioService.create(createUsuarioDto);
    delete usuario['senha']; //a senha já foi deletada no service
    return usuario;
  }

  @UseGuards(AuthGuard('jwt'))
  
  @Get()
  async findAuth(@Request() req): Promise<Usuarios> {
    const usuarioAutenticado = await this.usuarioService.findOne(req.user.id);
    delete usuarioAutenticado['senha'];
    return usuarioAutenticado;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUsuarioDto,
    @Request() req,
  ): Promise<Usuarios> {
    if (req.user.id != +id && !req.user.administrador) {
      throw new BadRequestException(
        'Só é possivel atualizar um cadastro pelo próprio usuário, ou usuários administradores.',
      );
    }
    if (!req.user.administrador && data.administrador == true) {
      throw new BadRequestException(
        'Um usuário não administrador não pode se tornar administrador por conta própria.',
      );
    }
    const usuarioAtualizado = await this.usuarioService.update(+id, data);
    delete usuarioAtualizado['senha'];
    return usuarioAtualizado;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<Usuarios> {
    if (req.user.id != +id && !req.user.administrador) {
      throw new BadRequestException(
        'Só é possivel excluir um cadastro pelo próprio usuário, ou usuários administradores.',
      );
    }
    return this.usuarioService.remove(+id);
  }
}
