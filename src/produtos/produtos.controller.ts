import { Request, Response } from 'express'
import { db } from '../database/banco-mongo.js'
import { ObjectId } from "mongodb";

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
}