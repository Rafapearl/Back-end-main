/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from 'src/upload/upload.module';
@Module({
  imports: [
    
    , 
    UsuarioModule, 
    PrismaModule, 
    AuthModule,
    UploadModule]})=
export class AppModule {}
