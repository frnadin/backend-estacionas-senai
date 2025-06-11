import Registro from "../models/registroModel.js";

export const VAGAS_MAXIMAS = 10;

export async function getVagasDisponiveis() {
  const entradasAtivas = await Registro.count({
    where: { tipo: "entrada", autorizado: true },
  });

  const saidasAtivas = await Registro.count({
    where: { tipo: "saida", autorizado: true },
  });

  return VAGAS_MAXIMAS - (entradasAtivas - saidasAtivas);
}