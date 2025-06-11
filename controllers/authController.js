import { Pessoa, Veiculo, Permissao, Registro } from '../../estacionamento-api/models/index.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authController = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await Pessoa.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Senha incorreta" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, type: user.type },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login bem-sucedido",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao realizar login", error: error.message });
    }
  },
};

export default authController;
