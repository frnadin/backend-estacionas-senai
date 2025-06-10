const authorize = (...allowedTypes) => {
  return (req, res, next) => {
    // O req.user vem do middleware de autenticação
    if (!req.user) {
      return res.status(401).json({ mensagem: "Usuário não autenticado" });
    }

    if (!allowedTypes.includes(req.user.type)) {
      return res.status(403).json({ mensagem: "Acesso negado: você não tem permissão" });
    }

    next();
  };
};

export { authorize };
