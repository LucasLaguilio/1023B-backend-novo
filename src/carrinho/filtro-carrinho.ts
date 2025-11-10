import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Conexão com o MongoDB
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("loja");
const carrinho = db.collection("carrinho");

// 🔹 Rota GET com filtro
app.get("/carrinho", async (req: Request, res: Response): Promise<void> => {
  const { nome, precoMin, precoMax } = req.query as {
    nome?: string;
    precoMin?: string;
    precoMax?: string;
  };

  const filtro: any = {};

  if (nome) {
    filtro.nome = { $regex: new RegExp(nome, "i") }; // busca parcial sem case sensitive
  }

  if (precoMin || precoMax) {
    filtro.preco = {};
    if (precoMin) filtro.preco.$gte = parseFloat(precoMin);
    if (precoMax) filtro.preco.$lte = parseFloat(precoMax);
  }

  try {
    const itens = await carrinho.find(filtro).toArray();
    res.json(itens);
  } catch (err) {
    console.error("Erro ao buscar itens:", err);
    res.status(500).json({ error: "Erro ao buscar itens" });
  }
});

// 🔹 Rota POST para adicionar item
app.post("/carrinho", async (req: Request, res: Response): Promise<void> => {
  const { nome, preco, quantidade } = req.body;

  if (!nome || !preco || !quantidade) {
    res.status(400).json({ error: "Dados incompletos" });
    return;
  }

  try {
    const result = await carrinho.insertOne({
      nome,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
    });
    res.json({ _id: result.insertedId, nome, preco, quantidade });
  } catch (err) {
    console.error("Erro ao adicionar item:", err);
    res.status(500).json({ error: "Erro ao adicionar item" });
  }
});

// 🔹 Inicia o servidor
app.listen(8000, () => {
  console.log("Servidor rodando em http://localhost:8000");
});