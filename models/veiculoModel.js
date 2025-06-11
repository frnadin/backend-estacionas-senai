import { DataTypes } from "sequelize";
import database from "../database.js";

const Veiculo = database.define(
  "Veiculos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("carro", "moto", "outro"),
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    obs: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Pessoas", 
        key: "id",
      },
    },
  },
  {
    tableName: "Veiculos",
    timestamps: true,
    underscored: true,
  }
);

export default Veiculo;
