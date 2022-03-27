/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Usuarios } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUsuarioDto): Promise<Usuarios> {
    const usuarioExiste = await this.prisma.usuarios.findFirst({
      where: {
        email: data.email,
      },
    });

    if (usuarioExiste) throw new ConflictException('Usuário já cadastrado!');

    if (data.senha !== data.confirmaSenha)
      throw new BadRequestException('Confira a senha!');

    delete data.confirmaSenha;
    data.senha = await hash(data.senha, 10);
    const usuario = await this.prisma.usuarios.create({ data });
    delete usuario.senha;
    return usuario;
  }

  async findByLogin(login: LoginDto): Promise<Usuarios> {
    const user = await this.prisma.usuarios.findFirst({
      where: {
        email: login.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const senhaIgual = await compare(login.senha, user.senha);

    if (!senhaIgual) {
      throw new UnauthorizedException('Senha inválida');
    }

    return user;
  }

  async findOne(id: number): Promise<Usuarios> {
    const usuario = await this.prisma.usuarios.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuário não cadastrado');
    } else {
      return usuario;
    }
  }

  async update(id: number, data: UpdateUsuarioDto): Promise<Usuarios> {
    const usuario = this.prisma.usuarios.findUnique({ where: { id } });
    if (data.senha) {
      // Só faz o hash da senha caso exista no body
      data.senha = await hash(data.senha, 10);
    }
    if (!usuario) {
      throw new NotFoundException('Usuário não cadastrado');
    }
    return this.prisma.usuarios.update({
      where: { id },
      data: { ...data },
    });
  }

  async remove(id: number): Promise<Usuarios> {
    const usuario = this.prisma.usuarios.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuário não cadastrado');
    }
    return this.prisma.usuarios.delete({ where: { id } });
  }
}
