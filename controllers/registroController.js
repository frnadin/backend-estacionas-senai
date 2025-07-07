import { Pessoa, Veiculo, Permissao, Registro } from "../models/index.js";
import { Op } from "sequelize";

import {
  VAGAS_MAXIMAS,
  getVagasDisponiveis,
} from "../services/estacionamentoService.js";

const registroController = {
  // Criar um novo registro de entrada ou saída
  async createByUser(req, res) {
    try {
      const { pessoa_id, veiculo_id, tipo } = req.body;

      // Verifica se o tipo é válido
      if (!["entrada", "saida"].includes(tipo)) {
        return res.status(400).json({ error: "Tipo inválido" });
      }

      const pessoa = await Pessoa.findByPk(pessoa_id);
      const veiculo = await Veiculo.findByPk(veiculo_id);

      if (!pessoa || !veiculo) {
        return res
          .status(404)
          .json({ error: "Pessoa ou veículo não encontrado" });
      }

      if (req.user.type !== "administrador") {
        if (pessoa.id !== req.user.id || veiculo.id_usuario !== req.user.id) {
          return res.status(403).json({
            error:
              "Você só pode registrar sua própria entrada/saída com seu veículo",
          });
        }
      }

      if (!veiculo.ativo) {
        const registro = await Registro.create({
          pessoa_id,
          veiculo_id,
          tipo,
          autorizado: false,
          motivo_bloqueio: "Veículo inativo",
        });
        return res.status(403).json({ error: "Veículo inativo", registro });
      }

      const permissao = await Permissao.findOne({
        where: {
          pessoa_id,
          veiculo_id,
          autorizado: true,
        },
        order: [["validade", "DESC"]],
      });

      if (!permissao) {
        const registro = await Registro.create({
          pessoa_id,
          veiculo_id,
          tipo,
          autorizado: false,
          motivo_bloqueio: "Permissão não encontrada",
        });
        return res
          .status(403)
          .json({ error: "Permissão não encontrada", registro });
      }

      // Mesma lógica de entrada/saída duplicada e estacionamento cheio
      return await criarRegistroComValidacoes(pessoa_id, veiculo_id, tipo, res);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async createByAdmin(req, res) {
    try {
      const { pessoa_id, veiculo_id, tipo } = req.body;

      if (!["entrada", "saida"].includes(tipo)) {
        return res.status(400).json({ error: "Tipo inválido" });
      }

      const pessoa = await Pessoa.findByPk(pessoa_id);
      const veiculo = await Veiculo.findByPk(veiculo_id);

      if (!pessoa || !veiculo) {
        return res
          .status(404)
          .json({ error: "Pessoa ou veículo não encontrado" });
      }

      if (!veiculo.ativo) {
        const registro = await Registro.create({
          pessoa_id,
          veiculo_id,
          tipo,
          autorizado: false,
          motivo_bloqueio: "Veículo inativo",
        });
        return res.status(403).json({ error: "Veículo inativo", registro });
      }

      const permissao = await Permissao.findOne({
        where: {
          pessoa_id,
          veiculo_id,
          autorizado: true,
        },
        order: [["validade", "DESC"]],
      });

      if (!permissao) {
        const registro = await Registro.create({
          pessoa_id,
          veiculo_id,
          tipo,
          autorizado: false,
          motivo_bloqueio: "Permissão não encontrada",
        });
        return res
          .status(403)
          .json({ error: "Permissão não encontrada", registro });
      }

      // Entrada/Saída, vagas e registros anteriores
      return await criarRegistroComValidacoes(pessoa_id, veiculo_id, tipo, res);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async create(req, res) {
    // console.log("Registro de entrada/saída solicitado:", req.body);
    // console.log("Usuário autenticado:", req.user);

    try {
      const { pessoa_id, veiculo_id, tipo } = req.body;

      // Verifica se a pessoa e o veiculo existem
      const pessoa = await Pessoa.findByPk(pessoa_id);
      const veiculo = await Veiculo.findByPk(veiculo_id);
      console.log(veiculo.toJSON());

      if (!pessoa)
        return res.status(404).json({ error: "Pessoa não encontrada" });
      if (!veiculo)
        return res.status(404).json({ error: "Veículo não encontrado" });

      // Verifica se o tipo é valid
      if (!["entrada", "saida"].includes(tipo)) {
        return res.status(400).json({ error: "Tipo inválido" });
      }

      // Verifica se o veiculo esta ativo
      if (!veiculo.ativo) {
        const registro = await Registro.create({
          pessoa_id,
          veiculo_id,
          tipo,
          autorizado: false,
          motivo_bloqueio: "Veículo inativo",
        });
        return res.status(403).json({ error: "Veículo inativo", registro });
      }

      // Verificação por regra de perfil
      if (["aluno", "professor"].includes(req.user.type)) {
        // Veículo deve pertencer ao usuário
        if (Number(veiculo.id_usuario) !== Number(req.user.id)) {
          const registro = await Registro.create({
            pessoa_id,
            veiculo_id,
            tipo,
            autorizado: false,
            motivo_bloqueio: "Veículo não pertence ao usuário",
          });
          return res.status(403).json({
            error: "Veículo não pertence ao usuário",
            registro,
          });
        }
        // Prossegue sem exigir Permissao
      } else {
        // Demais cargos precisam ter permissão válida
        const permissao = await Permissao.findOne({
          where: {
            pessoa_id,
            veiculo_id,
            autorizado: true,
          },
          order: [["validade", "DESC"]],
        });

        if (!permissao) {
          const registro = await Registro.create({
            pessoa_id,
            veiculo_id,
            tipo,
            autorizado: false,
            motivo_bloqueio: "Permissão não encontrada ou não autorizada",
          });
          return res.status(403).json({
            error: "Permissão não encontrada ou não autorizada",
            registro,
          });
        }
      }

      const ultimosRegistro = await Registro.findOne({
        where: { veiculo_id, autorizado: true },
        order: [["data_hora", "DESC"]],
      });

      // Verifica se o veiculo ja esta dentro do estacionamento
      if (tipo === "entrada" && ultimosRegistro?.tipo === "entrada") {
        return res
          .status(400)
          .json({ error: "Veículo já está dentro do estacionamento" });
      }

      // Evita saida sem entrada
      if (
        tipo === "saida" &&
        (!ultimosRegistro || ultimosRegistro.tipo !== "entrada")
      ) {
        return res
          .status(400)
          .json({ error: "Veículo não está dentro do estacionamento" });
      }

      // Verifica se o estacionamento esta lotadasso
      if (tipo === "entrada") {
        const vagasDisponiveis = await getVagasDisponiveis();

        if (vagasDisponiveis <= 0) {
          const registro = await Registro.create({
            pessoa_id,
            veiculo_id,
            tipo,
            autorizado: false,
            motivo_bloqueio: "Estacionamento cheio",
          });
          return res
            .status(403)
            .json({ error: "Estacionamento cheio", registro });
        }
      }

      // Cria o registro
      const registro = await Registro.create({
        pessoa_id,
        veiculo_id,
        tipo,
        autorizado: true,
      });

      return res.status(201).json(registro);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Listar todos os registros
  async getAll(req, res) {
    try {
      const registros = await Registro.findAll({
        include: [
          { model: Pessoa, attributes: ["id", "name", "cpf", "email"] },
          { model: Veiculo, attributes: ["id", "plate", "model", "color"] },
        ],
        order: [["data_hora", "DESC"]],
      });
      return res.status(200).json(registros);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Listar registros por pessoa
  async getByPessoa(req, res) {
    try {
      const { pessoa_id } = req.params;
      const registros = await Registro.findAll({
        where: { pessoa_id },
        include: [
          { model: Pessoa, attributes: ["id", "name", "cpf", "email"] },
          { model: Veiculo, attributes: ["id", "plate", "model", "color"] },
        ],
        order: [["data_hora", "DESC"]],
      });
      return res.status(200).json(registros);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  async getByVeiculo(req, res) {
    try {
      const { veiculo_id } = req.params;
      const registros = await Registro.findAll({
        where: { veiculo_id },
        include: [
          { model: Pessoa, attributes: ["id", "name", "cpf", "email"] },
          { model: Veiculo, attributes: ["id", "plate", "model", "color"] },
        ],
        order: [["data_hora", "DESC"]],
      });
      return res.status(200).json(registros);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async vagasDisponiveis(req, res) {
    try {
      const vagas = await getVagasDisponiveis();
      const vagasOcupadas = VAGAS_MAXIMAS - vagas;

      return res.status(200).json({
        vagas_disponiveis: vagas,
        vagas_ocupadas: vagasOcupadas,
        vagas_totais: VAGAS_MAXIMAS,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao calcular vagas disponíveis" });
    }
  },

  async getAbertos(req, res) {
    try {
      // Busca o ÚLTIMO registro autorizado de cada veículo
      const registros = await Registro.findAll({
        where: { autorizado: true },
        include: [{ model: Veiculo }, { model: Pessoa }],
        order: [["data_hora", "DESC"]],
      });

      // Filtra para só mostrar veículos cujo último registro é 'entrada'
      const ultimoPorVeiculo = {};

      registros.forEach((reg) => {
        const vId = reg.veiculo_id;
        if (!ultimoPorVeiculo[vId]) {
          ultimoPorVeiculo[vId] = reg;
        }
      });

      const abertos = Object.values(ultimoPorVeiculo).filter(
        (reg) => reg.tipo === "entrada"
      );

      res.status(200).json(abertos);
    } catch (error) {
      console.error("Erro ao buscar registros abertos:", error);
      res.status(500).json({ message: "Erro ao buscar registros abertos" });
    }
  },
};

export default registroController;

async function criarRegistroComValidacoes(pessoa_id, veiculo_id, tipo, res) {
  const ultimosRegistro = await Registro.findOne({
    where: { veiculo_id, autorizado: true },
    order: [["data_hora", "DESC"]],
  });

  if (tipo === "entrada" && ultimosRegistro?.tipo === "entrada") {
    return res
      .status(400)
      .json({ error: "Veículo já está dentro do estacionamento" });
  }

  if (
    tipo === "saida" &&
    (!ultimosRegistro || ultimosRegistro.tipo !== "entrada")
  ) {
    return res
      .status(400)
      .json({ error: "Veículo não está dentro do estacionamento" });
  }

  if (tipo === "entrada") {
    const vagasDisponiveis = await getVagasDisponiveis();
    if (vagasDisponiveis <= 0) {
      const registro = await Registro.create({
        pessoa_id,
        veiculo_id,
        tipo,
        autorizado: false,
        motivo_bloqueio: "Estacionamento cheio",
      });
      return res.status(403).json({ error: "Estacionamento cheio", registro });
    }
  }

  const registro = await Registro.create({
    pessoa_id,
    veiculo_id,
    tipo,
    autorizado: true,
  });

  return res.status(201).json(registro);
}
