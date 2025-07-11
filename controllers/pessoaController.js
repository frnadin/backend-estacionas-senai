import { Pessoa, Veiculo, Permissao, Registro } from '../models/index.js';

const pessoaController = {
  async create(req, res) {
    try {
      const {
        name,
        cpf,
        type,
        email,
        registrationSenai,
        phone,
        photo_url,
        password,
        birth
      } = req.body;
      const pessoa = await Pessoa.create({
        name,
        cpf,
        type,
        email,
        registrationSenai,
        phone,
        photo_url,
        password,
        birth
      });
      return res.status(201).json(pessoa);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const pessoas = await Pessoa.findAll();
      return res.status(200).json(pessoas);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const pessoa = await Pessoa.findByPk(id);
      if (!pessoa) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
      }
      return res.status(200).json(pessoa);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getMine(req, res) {
  try {
    const { id } = req.user;

    const pessoa = await Pessoa.findByPk(id);
    if (!pessoa) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json(pessoa);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
},

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        cpf,
        type,
        email,
        registrationSenai,
        phone,
        photo_url,
        password,
        birth,
      } = req.body;

      const pessoa = await Pessoa.findByPk(id);
      if (!pessoa) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
      }

      await pessoa.update({
        name,
        cpf,
        type,
        email,
        registrationSenai,
        phone,
        photo_url,
        password,
        birth
      });

      return res.status(200).json(pessoa);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const pessoa = await Pessoa.findByPk(id);
      if (!pessoa) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
      }

      await pessoa.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};

export default pessoaController;
