import { DataTypes } from "sequelize";
import database from "../database.js";


const Permissao = database.define(
  "Permissao",
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
    autorizado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    validade: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    motivo_bloqueio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Permissoes",
    timestamps: true,
  }
);


export default Permissao;
