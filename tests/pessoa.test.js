import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../app.js";
import { Pessoa } from "../models/index.js";

let tokenAdmin = "";
let pessoaId = null;

describe("Pessoa API", () => {
  beforeAll(async () => {
    // Limpar dados de teste antes
    await Pessoa.destroy({ where: { email: "pessoa@test.com" } });

    // Simula login para pegar token
    const loginRes = await request(app)
      .post("/login")
      .send({ email: "admin@test.com", password: "123" });

    if (!loginRes.body.token) {
      console.error("Falha ao obter token de admin:", loginRes.body);
      throw new Error("Não foi possível obter token de admin");
    }
    
    tokenAdmin = loginRes.body.token;
  });

  afterAll(async () => {
    // Limpar dados depois dos testes
    await Pessoa.destroy({ where: { email: "pessoa@test.com" } });
  });

  it("Deve criar uma nova pessoa", async () => {
    const res = await request(app)
      .post("/pessoas")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        name: "Pessoa Teste",
        cpf: "12345678900",
        type: "funcionario",
        email: "pessoa@test.com",
        registrationSenai: "SENAI123456",
        phone: "123456789",
        password: "senha123",
        birth: "1990-01-01",
      });

    if (res.status !== 201) {
      console.error("Falha ao criar pessoa:", res.body);
    }
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("pessoa@test.com");
    
    pessoaId = res.body.id; // Armazena o ID para usar nos outros testes
  });

  it("Deve retornar todas as pessoas", async () => {
    const res = await request(app)
      .get("/pessoas")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve retornar pessoa pelo id", async () => {
    if (!pessoaId) throw new Error("Nenhum ID de pessoa disponível");
    
    const res = await request(app)
      .get(`/pessoas/${pessoaId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("pessoa@test.com");
  });

  it("Deve atualizar uma pessoa", async () => {
    const pessoa = await Pessoa.findOne({ where: { email: "pessoa@test.com" } });

    const res = await request(app)
      .put(`/pessoas/${pessoa.id}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        name: "Pessoa Atualizada",
        phone: "987654321",
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Pessoa Atualizada");
    expect(res.body.phone).toBe("987654321");
  });

  it("Deve deletar uma pessoa", async () => {
    const pessoa = await Pessoa.findOne({ where: { email: "pessoa@test.com" } });

    const res = await request(app)
      .delete(`/pessoas/${pessoa.id}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(204);
  });

  it("Deve retornar 404 para pessoa não encontrada", async () => {
    const res = await request(app)
      .get("/pessoas/9999999")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(404);
  });

  it("Deve bloquear acesso sem token", async () => {
    const res = await request(app).get("/pessoas");
    expect([401, 403]).toContain(res.status);
  });
});
