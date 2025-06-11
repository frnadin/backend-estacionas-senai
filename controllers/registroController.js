import { Pessoa, Veiculo, Permissao, Registro } from '../models/index.js';


import {
  VAGAS_MAXIMAS,
  getVagasDisponiveis,
} from "../services/estacionamentoService.js";

const registroController = {
  // Criar um novo registro de entrada ou saída
  async create(req, res) {
    try {
      const { pessoa_id, veiculo_id, tipo } = req.body;

      // Verifica se a pessoa e o veiculo existem
      const pessoa = await Pessoa.findByPk(pessoa_id);
      const veiculo = await Veiculo.findByPk(veiculo_id);

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

      const permissao = await Permissao.findOne({
        where: { pessoa_id, veiculo_id, autorizado: true },
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
      } // Fecha o if aqui

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
};

export default registroController;
