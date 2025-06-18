import { Permissao, Pessoa, Veiculo } from "../models/index.js";

const permissaoController = {
  // Criar permissão
  async create(req, res) {
    try {
      const { pessoa_id, veiculo_id, autorizado, validade, motivo_bloqueio } = req.body;

      const permissao = await Permissao.create({
        pessoa_id,
        veiculo_id,
        autorizado,
        validade,
        motivo_bloqueio
      });

      return res.status(201).json(permissao);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Listar todas permissões
  async getAll(req, res) {
    try {
      const permissoes = await Permissao.findAll({
        include: [Pessoa, Veiculo], // pra trazer dados associados
      });
      return res.status(200).json(permissoes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Buscar por ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const permissao = await Permissao.findByPk(id, {
        include: [Pessoa, Veiculo],
      });

      if (!permissao) {
        return res.status(404).json({ error: "Permissão não encontrada" });
      }

      return res.status(200).json(permissao);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Atualizar permissão
  async update(req, res) {
    try {
      const { id } = req.params;
      const { pessoa_id, veiculo_id, autorizado, validade, motivo_bloqueio } = req.body;

      const permissao = await Permissao.findByPk(id);
      if (!permissao) {
        return res.status(404).json({ error: "Permissão não encontrada" });
      }

      await permissao.update({
        pessoa_id,
        veiculo_id,
        autorizado,
        validade,
        motivo_bloqueio,
      });

      return res.status(200).json(permissao);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Deletar permissão
  async delete(req, res) {
    try {
      const { id } = req.params;

      const permissao = await Permissao.findByPk(id);
      if (!permissao) {
        return res.status(404).json({ error: "Permissão não encontrada" });
      }

      await permissao.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};

export default permissaoController;
