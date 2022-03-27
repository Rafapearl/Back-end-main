-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "administrador" BOOLEAN NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);
