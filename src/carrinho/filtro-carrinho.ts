import express, { Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json()); 


interface ItemCarrinho {
  id?: number;
  nome: string;
  preco: number;
  quantidade: number;
}


const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loja",
});


app.get("/carrinho", async (req: Request, res: Response) => {
  const { nome, precoMin, precoMax } = req.query as {
    nome?: string;
    precoMin?: string;
    precoMax?: string;
  };

  let sql = "SELECT * FROM carrinho WHERE 1=1";
  const params: (string | number)[] = [];

  if (nome) {
    sql += " AND nome LIKE ?";
    params.push(`%${nome}%`);
  }

  if (precoMin) {
    sql += " AND preco >= ?";
    params.push(Number(precoMin));
  }

  if (precoMax) {
    sql += " AND preco <= ?";
    params.push(Number(precoMax));
  }

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar itens" });
  }
});

// POST /carrinho para adicionar item
app.post("/carrinho", async (req: Request, res: Response) => {
  const body = req.body as ItemCarrinho;

  if (!body.nome || !body.preco || !body.quantidade) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO carrinho (nome, preco, quantidade) VALUES (?, ?, ?)",
      [body.nome, body.preco, body.quantidade]
    );
    res.json({ id: (result as any).insertId, ...body });
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar item" });
  }
});

// Iniciar servidor
app.listen(8000, () => {
  console.log("Servidor rodando em http://localhost:8000");
});