import express from "express";
import cors from "cors";
import "dotenv/config";

import rotasNaoAutenticadas from "./rotas/rotas-nao-autenticadas.js";
import rotasAutenticadas from "./rotas/rotas-autenticadas.js";
import { Auth } from "./middlewares/auth.js";

const app = express();
app.use(cors());
app.use(express.json());


app.use(rotasNaoAutenticadas);


app.use(rotasAutenticadas);


app.listen(8000, () => console.log("Server rodando na porta 8000"))