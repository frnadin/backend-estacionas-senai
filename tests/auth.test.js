import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import app from "../app.js";
import { Pessoa } from "../models/index.js";
import bcrypt from "bcryptjs";

// Cria um usuário de teste antes dos testes
beforeAll(async () => {
  await Pessoa.destroy({ where: { email: "teste@example.com" } });

  await Pessoa.create({
    name: "Usuário Teste",
    email: "teste@example.com",
    password: "123",  // sem hash aqui, se tiver hook no model
    type: "administrador",
    cpf: "12345678900",
    registrationSenai: "SENAI123456",
  });
});


describe("POST /login", () => {
  it("Deve logar com credenciais válidas", async () => {
    const res = await request(app).post("/login").send({
      email: "teste@example.com",
      password: "123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("teste@example.com");
  });

  it("Deve falhar com senha incorreta", async () => {
    const res = await request(app).post("/login").send({
      email: "teste@example.com",
      password: "senhaerrada",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("Deve falhar com email inexistente", async () => {
    const res = await request(app).post("/login").send({
      email: "naoexiste@example.com",
      password: "123456",
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
