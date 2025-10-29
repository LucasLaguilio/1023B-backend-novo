import { Request, Response } from "express";
import { ObjectId } from "bson";
import { db } from "../database/banco-mongo.js";

// Interfaces
interface ItemCarrinho {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string;
    urlfoto: string;
    descricao: string;
}

interface Carrinho {
    _id?: ObjectId;
    usuarioId: string;
    itens: ItemCarrinho[];
    dataAtualizacao: Date;
    total: number;
}

interface AutenticacaoRequest extends Request {
    usuarioId?: string;
}

class CarrinhoController {
    // ADICIONAR ITEM
    async adicionarItem(req: AutenticacaoRequest, res: Response) {
        const { produtoId, quantidade } = req.body;
        const usuarioId = req.usuarioId;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }
        
        if (!produtoId || typeof quantidade !== 'number' || quantidade <= 0) {
            return res.status(400).json({ message: "Dados do item inválidos" });
        }
        
        // Buscar o produto no banco de dados
        const produto = await db.collection("produtos").findOne({ _id: new ObjectId(produtoId) });
        
        if (!produto) {
            return res.status(400).json({ message: "Produto não encontrado" });
        }
        
        // Extrair dados do produto
        const precoUnitario = produto.preco;
        const nome = produto.nome;
        const urlfoto = produto.urlfoto || '';
        const descricao = produto.descricao || '';
        
        // Buscar carrinho existente
        const carrinho = await db.collection<Carrinho>("Carrinho").findOne({ usuarioId: usuarioId });
        
        if (!carrinho) {
            // Criar novo carrinho
            const novoCarrinho: Carrinho = {
                usuarioId: usuarioId,
                itens: [{
                    produtoId: produtoId,
                    quantidade: quantidade,
                    precoUnitario: precoUnitario,
                    nome: nome,
                    urlfoto: urlfoto,
                    descricao: descricao
                }],
                dataAtualizacao: new Date(),
                total: precoUnitario * quantidade
            };
            
            await db.collection("Carrinho").insertOne(novoCarrinho);
            return res.status(201).json(novoCarrinho);
        }
        
        // Atualizar carrinho existente
        const itemExistente = carrinho.itens.find(item => item.produtoId === produtoId);
        
        if (itemExistente) {
            // Incrementar quantidade do item existente
            itemExistente.quantidade += quantidade;
        } else {
            // Adicionar novo item ao carrinho
            carrinho.itens.push({
                produtoId: produtoId,
                quantidade: quantidade,
                precoUnitario: precoUnitario,
                nome: nome,
                urlfoto: urlfoto,
                descricao: descricao
            });
        }
        
        // Recalcular total
        carrinho.total = carrinho.itens.reduce((acc, item) => 
            acc + (item.precoUnitario * item.quantidade), 0
        );
        carrinho.dataAtualizacao = new Date();

        await db.collection("Carrinho").updateOne(
            { usuarioId: usuarioId },
            { 
                $set: { 
                    itens: carrinho.itens, 
                    total: carrinho.total, 
                    dataAtualizacao: carrinho.dataAtualizacao 
                } 
            }
        );

        return res.status(200).json(carrinho);
    }

    // REMOVER ITEM
    async removerItem(req: AutenticacaoRequest, res: Response) {
        const { produtoId } = req.body;
        const usuarioId = req.usuarioId;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }
        
        const carrinho = await db.collection<Carrinho>("Carrinho").findOne({ usuarioId: usuarioId });

        if (!carrinho) {
            return res.status(404).json({ message: "Carrinho não encontrado" });
        }
        
        const itemIndex = carrinho.itens.findIndex(item => item.produtoId === produtoId);
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item não encontrado no carrinho" });
        }
        
        // Remover o item
        carrinho.itens.splice(itemIndex, 1);
        
        // Recalcular total
        carrinho.total = carrinho.itens.reduce((acc, item) => 
            acc + (item.precoUnitario * item.quantidade), 0
        );
        carrinho.dataAtualizacao = new Date();
        
        await db.collection("Carrinho").updateOne(
            { usuarioId: usuarioId },
            { 
                $set: { 
                    itens: carrinho.itens, 
                    total: carrinho.total, 
                    dataAtualizacao: carrinho.dataAtualizacao 
                } 
            }
        );
        
        return res.status(200).json(carrinho);
    }
    
    // ATUALIZAR QUANTIDADE
    async atualizarQuantidade(req: AutenticacaoRequest, res: Response) {
        const { produtoId, quantidade } = req.body;
        const usuarioId = req.usuarioId;
        
        if (!usuarioId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }
        
        if (typeof quantidade !== 'number' || quantidade <= 0) {
            return res.status(400).json({ message: "Quantidade deve ser maior que zero" });
        }

        const carrinho = await db.collection<Carrinho>("Carrinho").findOne({ usuarioId: usuarioId });
        
        if (!carrinho) {
            return res.status(404).json({ message: "Carrinho não encontrado" });
        }
        
        const item = carrinho.itens.find(item => item.produtoId === produtoId);
        
        if (!item) {
            return res.status(404).json({ message: "Item não encontrado no carrinho" });
        }
        
        // Atualizar quantidade
        item.quantidade = quantidade;
        
        // Recalcular total
        carrinho.total = carrinho.itens.reduce((acc, item) => 
            acc + (item.precoUnitario * item.quantidade), 0
        );
        carrinho.dataAtualizacao = new Date();
        
        await db.collection("Carrinho").updateOne(
            { usuarioId: usuarioId },
            { 
                $set: { 
                    itens: carrinho.itens, 
                    total: carrinho.total, 
                    dataAtualizacao: carrinho.dataAtualizacao 
                } 
            }
        );
        
        return res.status(200).json(carrinho);
    }
    
    // LISTAR CARRINHO
    async listar(req: AutenticacaoRequest, res: Response) {
        const usuarioId = req.usuarioId;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }
        
        const carrinho = await db.collection<Carrinho>("Carrinho").findOne({ usuarioId: usuarioId });
        
        if (!carrinho) {
            // Retorna carrinho vazio se não existir
            return res.status(200).json({ 
                usuarioId: usuarioId, 
                itens: [], 
                dataAtualizacao: new Date(), 
                total: 0 
            });
        }
        
        // Enriquecer os itens com urlfoto e descricao se estiverem faltando
        for (const item of carrinho.itens) {
            if (!item.urlfoto || !item.descricao) {
                const produto = await db.collection("produtos").findOne({ 
                    _id: new ObjectId(item.produtoId) 
                });
                
                if (produto) {
                    item.urlfoto = produto.urlfoto || '';
                    item.descricao = produto.descricao || '';
                }
            }
        }
        
        return res.status(200).json(carrinho);
    }
    
    // REMOVER CARRINHO COMPLETO
    async remover(req: AutenticacaoRequest, res: Response) {
        const usuarioId = req.usuarioId;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }

        const resultado = await db.collection("Carrinho").deleteOne({ usuarioId: usuarioId });
        
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ message: "Carrinho não encontrado" });
        }
        
        return res.status(200).json({ message: "Carrinho removido com sucesso" });
    }
}

export default new CarrinhoController();