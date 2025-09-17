import express, { Request, Response } from 'express'
import 'dotenv/config'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGOURI!)
await client.connect()
const db = client.db(process.env.MONGODB!)

const app = express()
//Esse middleware faz com que o 
// express faça o parse do body da requisição para json 
app.use(express.json())
//criando uma rota para acesso pelo navegador
app.get('/', async (_:Request, res:Response) => {
    res.send('Estoy working!')
})
app.get('/produtos', async (_:Request, res:Response) => {
    const produtos = await db.collection('produtos').find().toArray()
     res.status(200).json(produtos)
})

app.post('/produtos', async (req:Request, res:Response) => {
   const {nome,preco,urlfoto,descricao} = req.body
   if (!nome || !preco || !urlfoto || !descricao) {
    return res.status(400).json({error: 'Nome, preço, urlfoto e descrição são obrigatórios'})
   }
   
   const produto = {nome,preco,urlfoto,descricao}
   const result = await db.collection('produtos').insertOne(produto)
    res.status(201).json({nome, preco, urlfoto, descricao, _id:result.insertedId})

}) 
// Criando o servidor na porta 8000 com o express
app.listen(8000, () => {
    console.log('Server is running on port 8000')
})