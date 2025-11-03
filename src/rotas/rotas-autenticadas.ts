import { Router } from 'express'

import carrinhoController from '../carrinho/carrinho.controller.js'
import produtosController from '../produtos/produtos.controller.js'
import Auth from '../middlewares/auth.js' // Importa o Auth
import AuthAdmin from "../middlewares/authadmin.js" // Importa o novo AuthAdmin

const rotas = Router()

// Rota de criação de produto: Requer Autenticação E Autorização de Admin
rotas.post('/produtos', Auth, AuthAdmin, produtosController.adicionar)

// Rota de listagem de produtos: Não requer autenticação/autorização (público)
rotas.get('/produtos', produtosController.listar)


// --- Rotas do Carrinho: Requerem APENAS Autenticação (Qualquer usuário logado pode usar) ---

// Adicionar um item ao carrinho
rotas.post('/adicionarItem', Auth, carrinhoController.adicionarItem)

// Remover uma unidade de um item do carrinho
rotas.post('/removerunidadeItem', Auth, carrinhoController.removerunidadeItem)

// Listar o carrinho
rotas.get('/carrinho', Auth, carrinhoController.listar)

// Limpar o carrinho (remover)
rotas.delete('/carrinho', Auth, carrinhoController.remover)


rotas.post("/produtos", produtosController.adicionar);
rotas.get("/produtos", produtosController.listar);


rotas.post("/adicionarItem", carrinhoController.adicionarItem);
rotas.post("/removerItem", carrinhoController.removerItem);
rotas.get("/carrinho/:usuarioId", carrinhoController.listar);
rotas.delete("/carrinho/:usuarioId", carrinhoController.remover);

export default rotas;
