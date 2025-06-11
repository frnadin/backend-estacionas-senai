import { Pessoa, Veiculo, Permissao, Registro } from '../models/index.js';


const veiculoController = {
  // Criar um novo veículo vinculado a uma pessoa
  async create(req, res) {
    try {
      const { plate, model, color, type, id_usuario } = req.body;

      // Verifica se a pessoa existe antes de criar
      const pessoa = await Pessoa.findByPk(id_usuario);
      if (!pessoa) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
      }

      const veiculo = await Veiculo.create({
        plate,
        model,
        color,
        type,
        id_usuario,
      });
      return res.status(201).json(veiculo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Buscar todos os veiculos
  async getAll(req, res) {
    try {
      const veiculos = await Veiculo.findAll({
        include: [
          { model: Pessoa, attributes: ["id", "name", "cpf", "email"] },
        ],
      });
      return res.status(200).json(veiculos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Buscar um veículo por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const veiculo = await Veiculo.findByPk(id, {
        include: [
          { model: Pessoa, attributes: ["id", "name", "cpf", "email"] },
        ],
      });

      if (!veiculo) {
        return res.status(404).json({ error: "Veículo não encontrado" });
      }

      return res.status(200).json(veiculo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Atualizar um veículo
  async update(req, res) {
    try {
      const { id } = req.params;
      const { plate, model, color, type, id_usuario } = req.body;

      const veiculo = await Veiculo.findByPk(id);
      if (!veiculo) {
        return res.status(404).json({ error: "Veículo não encontrado" });
      }

      if (id_usuario) {
        const pessoa = await Pessoa.findByPk(id_usuario);
        if (!pessoa) {
          return res.status(404).json({ error: "Pessoa não encontrada" });
        }
      }

      await veiculo.update({
        plate: plate ?? veiculo.plate,
        model: model ?? veiculo.model,
        color: color ?? veiculo.color,
        type: type ?? veiculo.type,
        id_usuario: id_usuario ?? veiculo.id_usuario,
      });
      return res.status(200).json(veiculo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Deletar um veículo
  async delete(req, res) {
    try {
      const { id } = req.params;
      const veiculo = await Veiculo.findByPk(id);

      if (!veiculo) {
        return res.status(404).json({ error: "Veículo não encontrado" });
      }

      await veiculo.destroy();
      return res.status(200).send({msg: "deleted"});
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};

export default veiculoController;
