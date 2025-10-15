<<<<<<< HEAD
import express, { Request, Response, NextFunction } from 'express'
import 'dotenv/config'
import rotasNaoAutenticadas from './rotas/rotas-nao-autenticadas.js'
import rotasAutenticadas from './rotas/rotas-autenticadas.js'
import Auth from './middlewares/auth.js'
import cors from 'cors'
const app = express()
app.use(cors())

app.use(express.json())


// Usando as rotas definidas em rotas.ts
app.use(rotasNaoAutenticadas)
app.use(Auth)
app.use(rotasAutenticadas)
=======
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
>>>>>>> 5c061873aab0e755a4d269c13383c7e05421997d

// Criando o servidor na porta 8000 com o express
app.listen(8000, () => {
    console.log('Server is running on port 8000')
})