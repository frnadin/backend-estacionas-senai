import Pessoa from "./pessoaModel.js";
import Veiculo from "./veiculoModel.js";
import Permissao from "./permissaoModel.js";
import Registro from "./registroModel.js";

Pessoa.hasMany(Veiculo, { foreignKey: "id_usuario" });
Veiculo.belongsTo(Pessoa, { foreignKey: "id_usuario" });

Pessoa.hasMany(Permissao, { foreignKey: "pessoa_id", onDelete: "CASCADE" });
Permissao.belongsTo(Pessoa, { foreignKey: "pessoa_id" });

Veiculo.hasMany(Permissao, { foreignKey: "veiculo_id" });
Permissao.belongsTo(Veiculo, { foreignKey: "veiculo_id" });

Pessoa.hasMany(Registro, { foreignKey: "pessoa_id" });
Registro.belongsTo(Pessoa, { foreignKey: "pessoa_id" });

Veiculo.hasMany(Registro, { foreignKey: "veiculo_id" });
Registro.belongsTo(Veiculo, { foreignKey: "veiculo_id" });

export {
  Pessoa,
  Veiculo,
  Permissao,
  Registro,
};
