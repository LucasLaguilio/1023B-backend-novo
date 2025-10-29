import { Router } from "express";
import carrinhoController from "../carrinho/carrinho.controller.js";
import produtosController from "../produtos/produtos.controller.js";
import adiminPageController from "../adiminPage/adiminPageController.js";
import { apenasAdmin } from "../middlewares/apenasAdmin.js";

const rotas = Router();


rotas.post("/produtos", produtosController.adicionar);
rotas.get("/produtos", produtosController.listar);


rotas.post("/adicionarItem", carrinhoController.adicionarItem);
rotas.post("/removerItem", carrinhoController.removerItem);
rotas.get("/carrinho/:usuarioId", carrinhoController.listar);
rotas.delete("/carrinho/:usuarioId", carrinhoController.remover);


rotas.get("/admin/usuarios", apenasAdmin, adiminPageController.listarTodos);

export default rotas;