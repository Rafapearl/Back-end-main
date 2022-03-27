/* eslint-disable prettier/prettier */
import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto implements Prisma.UsuariosUncheckedCreateInput {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senha: string;

  @IsString()
  @IsNotEmpty()
  confirmaSenha: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsBoolean()
  @IsNotEmpty()
  administrador: boolean;
}
