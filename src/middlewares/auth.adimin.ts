import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  usuarioId: string;
  cargo: string;
}

interface AutenticacaoRequest extends Request {
  usuarioId?: string;
  cargo?: string;
}

export function AuthAdmin(req: AutenticacaoRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ mensagem: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ mensagem: "Token mal formado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    if (decoded.cargo !== "ADMIN") {
      return res.status(403).json({ mensagem: "Acesso negado. Apenas ADMIN." });
    }

    req.usuarioId = decoded.usuarioId;
    req.cargo = decoded.cargo;

    next(); // usuário ADMIN autorizado
  } catch (err) {
    console.error(err);
    return res.status(401).json({ mensagem: "Token inválido" });
  }
}