import { Request, Response } from 'express'
<<<<<<< HEAD
import { db } from '../database/banco-mongo.js'
class ProdutosController {
    async adicionar(req: Request, res: Response) {
        const { nome, preco, urlfoto, descricao } = req.body
        if (!nome || !preco || !urlfoto || !descricao)
            return res.status(400).json({ error: "Nome, preço, urlfoto e descrição são obrigatórios" })

        const produto = { nome, preco, urlfoto, descricao }
        const resultado = await db.collection('produtos').insertOne(produto)
        res.status(201).json({ nome, preco, urlfoto, descricao, _id: resultado.insertedId })
    }
    async listar(req: Request, res: Response) {
        const produtos = await db.collection('produtos').find().toArray()
        res.status(200).json(produtos)
    }
}

export default new ProdutosController()
=======
import { db } from '../database/banco-mongo'

class ProdutoController{
    async adicionar(req:Request, res:Response) {
       const {nome,preco,urlfoto,descricao} = req.body
   if (!nome || !preco || !urlfoto || !descricao) {
    return res.status(400).json({error: 'Nome, preço, urlfoto e descrição são obrigatórios'})
   }
   
   const produto = {nome,preco,urlfoto,descricao}
   const result = await db.collection('produtos').insertOne(produto)
    res.status(201).json({nome, preco, urlfoto, descricao, _id:result.insertedId})

    }
    async listar(_req:Request, res:Response) {
         const produtos = await db.collection('produtos').find().toArray()
         res.status(200).json(produtos)
    }
}

export default new ProdutoController()
>>>>>>> 5c061873aab0e755a4d269c13383c7e05421997d
