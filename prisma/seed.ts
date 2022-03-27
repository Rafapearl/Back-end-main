import { PrismaClient } from '@prisma/client';
import { usuarios } from './data/usuarios';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  await Promise.all(
    usuarios.map(async (usuario) => {
      usuario.senha = await hash(usuario.senha, 10);
      await prisma.usuarios.upsert({
        where: {
          id: usuario.id,
        },
        update: usuario,
        create: usuario,
      });
    }),
  );




seed()
  .catch((err) => {
    console.error(`Erro preenchendo o banco de dados: ${err}`);
    process.exit(1);
  })
  .then(async () => {
    console.log('Banco preenchido com sucesso, fim da conexão.');
    await prisma.$disconnect();
  })}
