import { DataTypes } from "sequelize";
import database from "../database.js";

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
        model: "Pessoas",
        key: "id",
      },
    },
    veiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Veiculos",
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

export default Registro;
