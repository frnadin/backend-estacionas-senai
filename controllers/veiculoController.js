import { Pessoa, Veiculo } from "../models/index.js";

const veiculoController = {
  // Criar um novo veículo vinculado a uma pessoa
  async create(req, res) {
    try {
      const { plate, model, color, type, id_usuario, obs } = req.body;
      let idPessoa;

      if (req.user.role === "aluno" || req.user.role === "professor") {
        idPessoa = req.user.id;
      } else {
        if (!id_usuario) {
          return res.status(400).json({ error: "id_usuario é obrigatório" });
        }
        idPessoa = id_usuario;
      }

      const pessoa = await Pessoa.findByPk(idPessoa);
      if (!pessoa) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
      }

      const veiculo = await Veiculo.create({
        plate,
        model,
        color,
        type,
        obs,
        id_usuario: idPessoa,
      });

      return res.status(201).json(veiculo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Buscar todos os veiculos
  // Restringe a visualização de veículos com base no papel do usuário

  async getAll(req, res) {
    try {
      let veiculos;
      // Funcionario/Ademiro ve tudo
      veiculos = await Veiculo.findAll({
        include: [
          { model: Pessoa, attributes: ["id", "name", "cpf", "email"] },
        ],
      });

      return res.status(200).json(veiculos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Buscar um veículos por ID
  // Restringe a visualização de veículos com base no papel do usuário

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

      if (
        (req.user.role === "aluno" || req.user.role === "professor") &&
        veiculo.id_usuario !== req.user.id
      ) {
        return res.status(403).json({ error: "Acesso não autorizado" });
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
      const { plate, model, color, type, id_usuario, obs } = req.body;

      const veiculo = await Veiculo.findByPk(id);
      if (!veiculo) {
        return res.status(404).json({ error: "Veículo não encontrado" });
      }
      if (
        (req.user.role === "aluno" || req.user.role === "professor") &&
        veiculo.id_usuario !== req.user.id
      ) {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }

      // Se o id_usuario for informado, validar (apenas para adm/funcionário)
      let novoIdUsuario = veiculo.id_usuario;
      if (id_usuario) {
        if (
          req.user.role === "administrador" ||
          req.user.role === "funcionario"
        ) {
          const pessoa = await Pessoa.findByPk(id_usuario);
          if (!pessoa) {
            return res.status(404).json({ error: "Pessoa não encontrada" });
          }
          novoIdUsuario = id_usuario;
        } else {
          return res
            .status(403)
            .json({ error: "Você não pode alterar o dono do veículo" });
        }
      }

      await veiculo.update({
        plate: plate ?? veiculo.plate,
        model: model ?? veiculo.model,
        color: color ?? veiculo.color,
        type: type ?? veiculo.type,
        obs: obs ?? veiculo.obs,
        id_usuario: novoIdUsuario,
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

      if (
        (req.user.role === "aluno" || req.user.role === "professor") &&
        veiculo.id_usuario !== req.user.id
      ) {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }

      await veiculo.destroy();
      return res.status(200).send({ msg: "Veículo deletado com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getMine(req, res) {
    try {
      const veiculos = await Veiculo.findAll({
        where: { id_usuario: req.user.id },
        include: [
          { model: Pessoa, attributes: ["id", "name", "cpf", "email"] },
        ],
      });

      return res.status(200).json(veiculos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async updateMine(req, res) {
    try {
      const { id } = req.params;
      const { plate, model, color, type, obs } = req.body;

      const veiculo = await Veiculo.findByPk(id);
      if (!veiculo) {
        return res.status(404).json({ error: "Veículo não encontrado" });
      }

      if (veiculo.id_usuario !== req.user.id) {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }

      await veiculo.update({
        plate: plate ?? veiculo.plate,
        model: model ?? veiculo.model,
        color: color ?? veiculo.color,
        type: type ?? veiculo.type,
        obs: obs ?? veiculo.obs
      });

      return res.status(200).json(veiculo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  async deleteMine(req, res) {
    try {
      const { id } = req.params;
      const veiculo = await Veiculo.findByPk(id);

      if (!veiculo) {
        return res.status(404).json({ error: "Veículo não encontrado" });
      }

      if (veiculo.id_usuario !== req.user.id) {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }

      await veiculo.destroy();
      return res.status(200).send({ msg: "Veículo deletado com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};

export default veiculoController;
