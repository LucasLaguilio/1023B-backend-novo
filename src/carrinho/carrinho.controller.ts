import { Request, Response } from 'express'
class CarrinhoController{
    adicionar(req:Request, res:Response) {
        res.status(201)
    }
    listar(req:Request, res:Response) {
        res.status(200)
    }
}

export default new CarrinhoController()