import { Router } from "express";
import adminPageController from "../adiminPage/adiminPageController.js";
import produtosController from "../produtos/produtos.controller.js";
import { AuthAdmin } from "../middlewares/auth.js";

const rotas = Router();

// Aplica AuthAdmin só a rotas admin
rotas.use(AuthAdmin);

// Listar todos os usuários
rotas.get("/usuarios", adminPageController.listarTodos);

// Deletar produto
rotas.delete("/produtos/:id", produtosController.deletar);

export default rotas;