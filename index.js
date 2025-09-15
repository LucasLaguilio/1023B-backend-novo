"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promise_1 = __importDefault(require("mysql2/promise"));
require("dotenv/config");
const app = (0, express_1.default)();
app.get('/', async (req, res) => {
    if (process.env.DBHOST === undefined) {
        res.status(500).send("DBHOST não está definido nas variáveis de ambiente");
        return;
    }
    if (process.env.DBUSER === undefined) {
        res.status(500).send("DBUSER não está definido nas variáveis de ambiente");
        return;
    }
    if (process.env.DBPASSWORD === undefined) {
        res.status(500).send("DBPASSWORD não está definido nas variáveis de ambiente");
        return;
    }
    if (process.env.DBDATABASE === undefined) {
        res.status(500).send("DBDATABASE não está definido nas variáveis de ambiente");
        return;
    }
    if (process.env.DBPORT === undefined) {
        res.status(500).send("DBPORT não está definido nas variáveis de ambiente");
        return;
    }
    try {
        const conn = await promise_1.default.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBDATABASE,
            port: Number(process.env.DBPORT)
        });
        res.send("Conectado ao banco de dados com sucesso!");
    }
    catch (err) {
        if (err instanceof Error === false) {
            res.status(500).send("Erro desconhecido ao conectar ao banco de dados");
            return;
        }
        const error = err;
        res.status(500).send("Erro ao conectar ao banco de dados: " + error.message);
    }
});
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
//# sourceMappingURL=index.js.map