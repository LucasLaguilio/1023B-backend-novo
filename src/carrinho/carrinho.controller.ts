import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../database/banco-mongo.js";

interface AutenticacaoRequest extends Request {
    usuarioId?: string;
}

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


class CarrinhoController {
    
    async adicionarItem(req: AutenticacaoRequest, res: Response) {
        const { produtoId, quantidade } = req.body;
        const usuarioId = req.usuarioId;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }
        
        if (!produtoId || typeof quantidade !== 'number' || quantidade <= 0) {
            return res.status(400).json({ message: "Dados do item inválidos" });
        }
        
        
        const produto = await db.collection("produtos").findOne({ _id: new ObjectId(produtoId) });
        
        if (!produto) {
            return res.status(400).json({ message: "Produto não encontrado" });
        }
        
        
        const precoUnitario = produto.preco;
        const nome = produto.nome;
        const urlfoto = produto.urlfoto || '';
        const descricao = produto.descricao || '';
        
    
        const carrinho = await db.collection<Carrinho>("Carrinho").findOne({ usuarioId: usuarioId });
        
        if (!carrinho) {
        
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
        
      
        const itemExistente = carrinho.itens.find(item => item.produtoId === produtoId);
        
        if (itemExistente) {
           
            itemExistente.quantidade += quantidade;
        } else {
            
            carrinho.itens.push({
                produtoId: produtoId,
                quantidade: quantidade,
                precoUnitario: precoUnitario,
                nome: nome,
                urlfoto: urlfoto,
                descricao: descricao
            });
        }
        
      
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
        
        
        carrinho.itens.splice(itemIndex, 1);
        
        
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

    // Sheron: Função para remover uma unidade de um item do carrinho
        async removerunidadeItem(req: AutenticacaoRequest, res: Response) {
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
    
            const item = carrinho.itens[itemIndex];
            if (!item) {
               
                return res.status(404).json({ message: "Item não encontrado no carrinho" });
            }
            
            if (item.quantidade > 1) {
                
                item.quantidade -= 1;
            } else if (item.quantidade === 1) {
               
                carrinho.itens.splice(itemIndex, 1);
            } else {
                return res.status(400).json({ message: "Quantidade inválida para remoção" });
            }
    
            
            carrinho.total = carrinho.itens.reduce((acc, currentItem) => 
                acc + (currentItem.precoUnitario * currentItem.quantidade), 0
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
        
        
        item.quantidade = quantidade;
        
        
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
    
    
    async listar(req: AutenticacaoRequest, res: Response) {
        const usuarioId = req.usuarioId;

        if (!usuarioId) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }
        
        const carrinho = await db.collection<Carrinho>("Carrinho").findOne({ usuarioId: usuarioId });
        
        if (!carrinho) {
            
            return res.status(200).json({ 
                usuarioId: usuarioId, 
                itens: [], 
                dataAtualizacao: new Date(), 
                total: 0 
            });
        }
        

        // Otimização: Apenas atualiza dados de exibição se estiverem faltando (mas não salva no DB)
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