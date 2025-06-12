import { Permissao, Pessoa, Veiculo} from "../models/index.js";

const permissaoController = {
    async create(req, res) {
        try {
            const { pessoa_id, veiculo_id, autorizado, validade, motivo_bloqueio } = req.body;

            const permissao = await Permissao.create({
                pessoa_id,
                veiculo_id,
                autorizado,
                validade,
                motivo_bloqueio
            });
        
            return res.status(201).json(permissao);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },


}

export default permissaoController;