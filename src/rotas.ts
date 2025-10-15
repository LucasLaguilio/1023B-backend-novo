import {Router} from 'express'

// Update the import path if the file is named differently or located elsewhere
import carrinhoController from './carrinho/carrinho.controller'
import produtoController from './produtos/produtos.controller'
import usuarioController from './usuarios/usuarios.controller'
const rotas = Router()

// Rotas do Carrinho
rotas.get('/carrinho',carrinhoController.listar)
rotas.post('/carrinho',carrinhoController.adicionar)

// Rotas dos Produtos
rotas.get('/produtos',produtoController.listar)
rotas.post('/produtos',produtoController.adicionar)

rotas.get('/usuarios',usuarioController.listar)
rotas.post('/usuarios',usuarioController.adicionar)

export default rotas
