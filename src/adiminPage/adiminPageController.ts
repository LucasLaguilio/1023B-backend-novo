import { Request, Response } from "express";


const usuarios = [
  { id: 1, nome: "Rafaela", email: "rafaela@email.com", cargo: "ADMIN" },
  { id: 2, nome: "João", email: "joao@email.com", cargo: "USER" },
  { id: 3, nome: "Maria", email: "maria@email.com", cargo: "USER" },
];

async function listarTodos(req: Request, res: Response) {
  try {
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ erro: "Erro ao listar usuários." });
  }
}

export default { listarTodos };