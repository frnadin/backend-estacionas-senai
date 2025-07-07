import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import app from "../app.js";

let tokenAdmin;
let tokenAluno;
let veiculoIdAluno;
let veiculoIdAdmin;
let pessoaIdAluno = 1; // ajuste se precisar

beforeAll(async () => {
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
});

describe("Veículos - CRUD", () => {
  it("Deve criar um veículo como admin", async () => {
    const res = await request(app)
      .post("/veiculos")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        plate: "ABC-1234",
        model: "Fiesta",
        color: "Prata",
        type: "carro",
        id_usuario: pessoaIdAluno,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    veiculoIdAdmin = res.body.id;
  });

  it("Deve criar um veículo como aluno", async () => {
    const res = await request(app)
      .post("/veiculos/meus")
      .set("Authorization", `Bearer ${tokenAluno}`)
      .send({
        plate: "XYZ-5678",
        model: "Civic",
        color: "Preto",
        type: "carro",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    veiculoIdAluno = res.body.id;
  });

  it("Deve listar meus veículos", async () => {
    const res = await request(app)
      .get("/veiculos/meus")
      .set("Authorization", `Bearer ${tokenAluno}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve atualizar meu veículo", async () => {
    const res = await request(app)
      .put(`/veiculos/meus/${veiculoIdAluno}`)
      .set("Authorization", `Bearer ${tokenAluno}`)
      .send({ color: "Vermelho" });
    expect(res.statusCode).toBe(200);
    expect(res.body.color).toBe("Vermelho");
  });

  it("Deve deletar meu veículo", async () => {
    const res = await request(app)
      .delete(`/veiculos/meus/${veiculoIdAluno}`)
      .set("Authorization", `Bearer ${tokenAluno}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("msg");
  });

  it("Deve buscar todos os veículos (admin)", async () => {
    const res = await request(app)
      .get("/veiculos")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve buscar veículo por ID", async () => {
    const res = await request(app)
      .get(`/veiculos/${veiculoIdAdmin}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  it("Deve atualizar veículo por ID", async () => {
    const res = await request(app)
      .put(`/veiculos/${veiculoIdAdmin}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ model: "Focus" });
    expect(res.statusCode).toBe(200);
    expect(res.body.model).toBe("Focus");
  });

  it("Deve listar veículos por dono", async () => {
    const res = await request(app)
      .get(`/veiculos/dono/${pessoaIdAluno}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve deletar veículo por ID", async () => {
    const res = await request(app)
      .delete(`/veiculos/${veiculoIdAdmin}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("msg");
  });
});
