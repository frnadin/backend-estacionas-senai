import bcrypt from 'bcryptjs';
import Pessoa from '../models/pessoaModel.js'; 
import database from '../database.js';    

async function updatePasswords() {
  try {
    await database.authenticate();
    console.log('Conectado ao banco!');

    const hash = await bcrypt.hash('123', 10);

    const [rowsUpdated] = await Pessoa.update(
      { password: hash },
      { where: {} }
    );

    console.log(`${rowsUpdated} senhas atualizadas.`);
  } catch (err) {
    console.error('Erro ao atualizar senhas:', err);
  } finally {
    await database.close();
  }
}

updatePasswords();
