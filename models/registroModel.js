import { DataTypes } from "sequelize";
import database from "../database.js";
import Pessoa from "./pessoaModel.js";
import Veiculo from "./veiculoModel.js";

const Registro = database.define(
  "Registros",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pessoa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pessoa,
        key: "id",
      },
    },
    veiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Veiculo,
        key: "id",
      },
    },
    tipo: {
      type: DataTypes.ENUM("entrada", "saida"),
      allowNull: false,
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    autorizado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    motivo_bloqueio: {
      type: DataTypes.STRING,
      allowNull: true, // "veiculo não autorizado" "Estacionamento cheio" ...
    },
  },
  {
    tableName: "Registros",
    timestamps: true,
    underscored: true,
  }
);

// Relacionamento
Pessoa.hasMany(Registro, { foreignKey: "pessoa_id" });
Registro.belongsTo(Pessoa, { foreignKey: "pessoa_id" });

Veiculo.hasMany(Registro, { foreignKey: "veiculo_id" });
Registro.belongsTo(Veiculo, { foreignKey: "veiculo_id" });

export default Registro;
