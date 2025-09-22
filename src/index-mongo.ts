import express, { Request, Response } from 'express'
import 'dotenv/config'
import rotas from './rotas'

const app = express()
//Esse middleware faz com que o 
// express faça o parse do body da requisição para json 
app.use(express.json())
//criando uma rota para acesso pelo navegador
app.get('/', async (_:Request, res:Response) => {
    res.send('Estoy working!')
})

app.use(rotas)

// Criando o servidor na porta 8000 com o express
app.listen(8000, () => {
    console.log('Server is running on port 8000')
})