import jwt from "jsonwebtoken";

export function apenasAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ erro: "Token não fornecido." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ erro: "Token inválido." });
    }

    
    const dados = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = dados;

   
    if (req.usuario.cargo !== "ADMIN") {
      return res.status(403).json({ erro: "Acesso negado. Apenas ADMIN." });
    }

    next();
  } catch (erro) {
    console.error(erro);
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}