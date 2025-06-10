
// ////TERMINAR O CÓDIGO
// ////TERMINAR O CÓDIGO
// ////TERMINAR O CÓDIGO
// ////TERMINAR O CÓDIGO
// ////TERMINAR O CÓDIGO
// ////TERMINAR O CÓDIGO
// ////TERMINAR O CÓDIGO
// ////TERMINAR O CÓDIGO

// import Registro from "../models/registroModel.js";
// import Pessoa from "../models/pessoaModel.js";
// import Veiculo from "../models/veiculoModel.js";

// const VAGAS_MAXIMAS = 10;

// const registroController = {
//   // Criar um novo registro de entrada ou saída
//   async create(req, res) {
//     try {
//       const { pessoa_id, veiculo_id, tipo } = req.body;

//       // Verifica se a pessoa e o veíveiculoculo existem
//       const pessoa = await Pessoa.findByPk(pessoa_id);
//       const veiculo = await Veiculo.findByPk(veiculo_id);
      
//       if (!pessoa)
//         return res.status(404).json({ error: "Pessoa não encontrada" });
//       if (!veiculo)
//         return res.status(404).json({ error: "Veículo não encontrado" });

//       // Verifica se o veiculo esta ativo
//       if (!veiculo.ativo) {
//         const registro = await Registro.create({
//           pessoa_id,
//           veiculo_id,
//           tipo,
//           autorizado: false,
//           motivo_bloqueio: "Veículo inativo",
//         });
//         return res.status(403).json({ error: "Veículo inativo", registro });
//       }

//       // Verifica se o tipo é valid
//       if (!["entrada", "saida"].includes(tipo)) {
//         return res.status(400).json({ error: "Tipo inválido" });
//       }

//           // Verifica duplicidade de entrada
//         if (tipo === "entrada") {
//         const registrosEntrada = await Registro.count({
//           where: {
//             veiculo_id,
//             tipo: "entrada",
//             autorizado: true,
//           },
//           order: [["created_at", "DESC"]],
//         });

//         const registrosSaida = await Registro.count({
//           where: {
//             veiculo_id,
//             tipo: "saida",
//             autorizado: true,
//           },
//           order: [["created_at", "DESC"]],
//         });

//       const registro = await Registro.create({
//         pessoa_id,
//         veiculo_id,
//         tipo,
//       });

//       return res.status(201).json(registro);
//     } catch (error) {
//       return res.status(400).json({ error: error.message });
//     }
//   },

//   // Buscar todos os registros
//   async getAll(req, res) {
//     try {
//       const registros = await Registro.findAll({
//         include: [
//           { model: Pessoa, attributes: ["id", "name", "cpf", "email"] },
//           { model: Veiculo, attributes: ["id", "plate", "model", "color"] },
//         ],
//       });
//       return res.status(200).json(registros);
//     } catch (error) {
//       return res.status(400).json({ error: error.message });
//     }
//   },

//   // Buscar um registro por ID
//   async getById(req, res) {
//     try {
//       const { id } = req.params;
//       const registro = await Registro.findByPk(id, {
//         include: [
//           { model: Pessoa, attributes: ["id", "name", "cpf", "email"] },
//           { model: Veiculo, attributes: ["id", "plate", "model", "color"] },
//         ],
//       });

//       if (!registro) {
//         return res.status(404).json({ error: "Registro não encontrado" });
//       }

//       return res.status(200).json(registro);
//     } catch (error) {
//       return res.status(400).json({ error: error.message });
//     }
//   },
// };
