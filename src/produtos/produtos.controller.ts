import { Request, Response } from 'express'
import { db } from '../database/banco-mongo.js'
import { ObjectId } from 'mongodb' // Importar ObjectId para consistência

// Interface para o documento Produto (útil para tipagem)
interface Produto {
    _id?: ObjectId;
    nome: string;
    preco: number;
    urlfoto: string;
    descricao: string;
    categoria?: string; // Adicionando categoria, que é usada na busca
}

// Estendendo Request para incluir a query 'q'
interface BuscaRequest extends Request {
    query: {
        q?: string;
    }
}

class ProdutoController {
    
    async adicionar(req: Request, res: Response) {
        // ... (Sua implementação existente) ...
        const { nome, preco, urlfoto, descricao, categoria } = req.body; // Adicionado 'categoria' para ser mais completo
        
        if (!nome || !preco || !urlfoto || !descricao) {
            return res.status(400).json({ error: 'Nome, preço, urlfoto e descrição são obrigatórios' });
        }
        
        // Incluindo categoria na inserção, se existir, para que a busca funcione
        const produto: Omit<Produto, '_id'> = { nome, preco, urlfoto, descricao, categoria }; 
        const result = await db.collection<Produto>('produtos').insertOne(produto);
        
        res.status(201).json({ ...produto, _id: result.insertedId });
    }
    
    async listar(_req: Request, res: Response) {
        // ... (Sua implementação existente) ...
        const produtos = await db.collection<Produto>('produtos').find().toArray();
        res.status(200).json(produtos);
    }

    /**
     * @route GET /produtos/buscar?q=termo
     * Filtra produtos por nome ou categoria (case-insensitive).
     */
    async buscar(req: BuscaRequest, res: Response) {
        const query = req.query.q; // Captura o termo de busca 'q'

        // 1. Trata o caso de busca vazia, retornando todos os produtos
        if (!query || query.trim() === "") {
            // Reutiliza a função listar
            return this.listar(req, res);
        }

        const termoBusca = query.trim();
        
        try {
            // 2. Configuração do filtro para o MongoDB (Case-Insensitive)
            const regexQuery = {
                $regex: termoBusca, 
                $options: 'i' // 'i' para Case-Insensitive
            };

            // O operador $or permite buscar em múltiplos campos: 'nome' OU 'categoria'
            const filtro = {
                $or: [
                    { nome: regexQuery },       
                    { categoria: regexQuery }   
                ]
            };

            // 3. Executa a busca no MongoDB
            const produtosEncontrados = await db.collection<Produto>("produtos")
                                                .find(filtro)
                                                .toArray();

            return res.status(200).json(produtosEncontrados);

        } catch (error) {
            console.error("Erro ao realizar busca de produtos:", error);
            return res.status(500).json({ message: "Erro interno do servidor ao buscar produtos." });
        }
    }
}

export default new ProdutoController();