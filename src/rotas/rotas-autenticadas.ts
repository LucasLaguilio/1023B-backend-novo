import { Router } from 'express'
import produtosController from '../produtos/produtos.controller.js'
import carrinhoController from '../carrinho/carrinho.controller.js'
import Auth from '../middlewares/auth.js'

const rotas = Router()

// Produtos
rotas.post('/produtos', produtosController.adicionar)
rotas.get('/produtos', produtosController.listar)

// Carrinho
rotas.post('/adicionarItem', Auth, carrinhoController.adicionarItem)
rotas.post('/removerItem', Auth, carrinhoController.removerItem)
rotas.get('/carrinho', Auth, carrinhoController.listar)
rotas.delete('/carrinho', Auth, carrinhoController.remover)

export default rotas
