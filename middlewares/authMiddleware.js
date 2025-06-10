import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_KEY || 'hehehehehehe'; 

const auth = (req, res, next) => {
  try {
    console.log('Autenticando...');

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ mensagem: 'Acesso negado: token ausente ou inválido' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);

    const contentToken = jwt.verify(token, secret);

    req.user = {
      id: contentToken.id,
      email: contentToken.email,
      type: contentToken.type,
    };

    next();
  } catch (erro) {
    console.error('Erro no auth middleware:', erro.name, erro.message);
    return res.status(401).json({ mensagem: 'Token inválido ou expirado', erro: erro.message });
  }
};

export { auth };
