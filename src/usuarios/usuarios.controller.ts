import { Request, Response } from 'express'
import { db } from '../database/banco-mongo'
import bcrypt from 'bcryptjs'
class UsuariosController{
async adicionar(req:Request, res:Response) {
    const {nome, idade, email, senha} = req.body
    if (!nome || !idade || !email || !senha) {
        return res.status(400).json({error: 'Nome, idade, email e senha são obrigatórios'})
    }
    if (senha.length < 6) {
        return res.status(400).json({error: 'A senha deve ter pelo menos 6 caracteres'})
    }
    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({error: 'Email inválido'})
    }
    const senhaHash = await bcrypt.hash(senha, 8)
    const usuario = { nome, idade, email, senha: senhaHash }
    const resultado = await db.collection('usuarios').insertOne(usuario)
    res.status(201).json({nome, idade, email, senha})
}
    async listar(_req:Request, res:Response) {
         const usuarios = await db.collection('usuarios').find({},{}).toArray()
         const usuariosSemSenha = usuarios.map(({senha, ...resto}) => resto)
         res.status(200).json(usuariosSemSenha)
    }
}

export default new UsuariosController()