import { DataTypes } from "sequelize";
import database from "../database.js";

const Pessoa = database.define(
  "Pessoa",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [11, 14],
      },
    },
    type: {
      type: DataTypes.ENUM("aluno", "professor", "funcionario"),
      allowNull: false,
    },
    registrationSenai: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Pessoas",
    timestamps: true,
    underscored: true,
  }
);

export default Pessoa;

