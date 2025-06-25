import { DataTypes } from "sequelize";
import database from "../database.js";
import bcrypt from "bcryptjs";

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
      type: DataTypes.ENUM("aluno", "professor", "funcionario", "visitante", "administrador"),
      allowNull: false,
    },
    registrationSenai: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [3, 100],
      },
    },
  },
  {
    tableName: "Pessoas",
    timestamps: true,
    underscored: true,
  }
);

Pessoa.beforeCreate(async (pessoa) => {
  if (pessoa.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    pessoa.password = await bcrypt.hash(pessoa.password, salt);
  }
});

Pessoa.beforeUpdate(async (pessoa) => {
  if (pessoa.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    pessoa.password = await bcrypt.hash(pessoa.password, salt);
  }
});


export default Pessoa;

