import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import app from "../app.js"; // Caminho do seu express()

let tokenAdmin;
let tokenAluno;
let pessoaId;
let veiculoId;

beforeAll(async () => {
  // 🔐 Faça login para pegar um token de admin e outro de aluno
  const loginAdmin = await request(app).post("/login").send({
    email: "admin@example.com",
    password: "123456",
  });
  tokenAdmin = loginAdmin.body.token;

  const loginAluno = await request(app).post("/login").send({
    email: "aluno@example.com",
    password: "123456",
  });
  tokenAluno = loginAluno.body.token;

  // 🔎 Crie ou pegue uma pessoa e um veículo válidos
  // Supondo que já existam no banco para facilitar
  pessoaId = 1; // Altere para um ID real
  veiculoId = 1; // Altere para um ID real
});

describe("Registros - Estacionamento", () => {
  it("Deve criar um registro de entrada pelo usuário", async () => {
    const res = await request(app)
      .post("/registros")
      .set("Authorization", `Bearer ${tokenAluno}`)
      .send({
        pessoa_id: pessoaId,
        veiculo_id: veiculoId,
        tipo: "entrada",
      });

    expect([201, 403, 400]).toContain(res.statusCode);
    expect(res.body).toBeTypeOf("object");
  });

  it("Deve criar um registro de saída pelo usuário", async () => {
    const res = await request(app)
      .post("/registros")
      .set("Authorization", `Bearer ${tokenAluno}`)
      .send({
        pessoa_id: pessoaId,
        veiculo_id: veiculoId,
        tipo: "saida",
      });

    expect([201, 400]).toContain(res.statusCode);
    expect(res.body).toBeTypeOf("object");
  });

  it("Deve criar um registro de entrada pelo admin", async () => {
    const res = await request(app)
      .post("/registros/admin")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        pessoa_id: pessoaId,
        veiculo_id: veiculoId,
        tipo: "entrada",
      });

    expect([201, 403, 400]).toContain(res.statusCode);
    expect(res.body).toBeTypeOf("object");
  });

  it("Deve listar todos os registros", async () => {
    const res = await request(app)
      .get("/registros")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve listar registros por pessoa", async () => {
    const res = await request(app)
      .get(`/registros/pessoa/${pessoaId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve listar registros por veículo", async () => {
    const res = await request(app)
      .get(`/registros/veiculo/${veiculoId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve retornar vagas disponíveis", async () => {
    const res = await request(app)
      .get("/registros/vagas-disponiveis")
      .set("Authorization", `Bearer ${tokenAluno}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("vagas_disponiveis");
  });

  it("Deve retornar registros abertos", async () => {
    const res = await request(app)
      .get("/registros/abertos")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("Registros - Erros", () => {
  it("Deve retornar 403 se usuário não autorizado tentar criar registro", async () => {
    const res = await request(app)
      .post("/registros")
      .set("Authorization", `Bearer ${tokenAluno}`)
      .send({
        pessoa_id: pessoaId,
        veiculo_id: veiculoId,
        tipo: "entrada",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error");
  });

  it("Deve retornar 400 se dados inválidos forem enviados", async () => {
    const res = await request(app)
      .post("/registros")
      .set("Authorization", `Bearer ${tokenAluno}`)
      .send({
        pessoa_id: null, // Dados inválidos
        veiculo_id: veiculoId,
        tipo: "entrada",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});