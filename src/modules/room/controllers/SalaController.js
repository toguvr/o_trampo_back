import AppError from '@shared/errors/AppError';
import { comprar, embaralhar, montarBaralho } from '../../../utils';
import {
  writeDb,
  getDb,
  findRoom,
  findRoomIndex,
} from '../../../database/DbRepository';

export default class SalaController {
  async index(req, res) {
    const { sala_id } = req.params;

    const salaCorreta = findRoom(sala_id);

    if (!salaCorreta) {
      throw new AppError('Sala nao encontrada');
    }

    return res.status(200).json(salaCorreta);
  }

  async start(req, res) {
    const { sala_id, user_id } = req.body;
    const db = getDb();

    const salaCorreta = findRoom(sala_id);

    if (!salaCorreta) {
      throw new AppError('Sala nao encontrada');
    }

    const salaIndex = findRoomIndex(sala_id);

    if (String(salaCorreta.adminId) !== String(user_id)) {
      return res
        .status(401)
        .json({ message: 'Apenas o admin pode iniciar a partida' });
    }

    const cartas = montarBaralho(5);

    embaralhar(cartas);

    const usuariosResetados = salaCorreta.usuarios.map(usuario => {
      return {
        ...usuario,
        duvido: false,
        passou: false,
        moedas: 0,
        cartas: comprar(cartas, 2),
      };
    });

    salaCorreta.usuarios = usuariosResetados;
    salaCorreta.baralho = cartas;
    salaCorreta.espera = false;
    salaCorreta.rodada = 1;

    db[salaIndex] = salaCorreta;

    await writeDb(db);

    req.io.to(`room${sala_id}`).emit('joinRoom');

    return res.status(200).json(db[salaIndex]);
  }

  async create(req, res) {
    const { nome_sala, nome_usuario, avatar } = req.body;
    const db = getDb();

    const salaIndex = db.findIndex(sala => {
      return (
        String(sala.nome).toLowerCase() === String(nome_sala).toLowerCase()
      );
    });

    if (!nome_sala || !nome_usuario || !avatar) {
      return res.status(400).json({ message: 'Algum dado nao enviado' });
    }

    if (salaIndex === -1) {
      const salaId = db.length;

      db.push({
        id: salaId,
        espera: false,
        nome: nome_sala,
        adminId: 1,
        rodada: 0,
        baralho: [],
        usuarios: [
          {
            id: 1,
            nome: nome_usuario,
            avatar,
            cartas: [],
            duvido: false,
            passou: false,
            moedas: 0,
          },
        ],
      });

      await writeDb(db);

      return res.status(200).json({
        sala: {
          id: salaId,
          espera: false,
          nome: nome_sala,
          adminId: 1,
          rodada: 0,
          baralho: [],
          usuarios: [
            {
              id: 1,
              nome: nome_usuario,
              avatar,
              cartas: [],
              duvido: false,
              passou: false,
              moedas: 0,
            },
          ],
        },
        user: 1,
      });
    }

    const numeroDeUsuariosNaSala = db[salaIndex]?.usuarios?.length;

    db[salaIndex].usuarios.push({
      id: numeroDeUsuariosNaSala + 1,
      nome: nome_usuario,
      avatar,
      cartas: [],
      duvido: false,
      passou: false,
      moedas: 0,
    });

    await writeDb(db);

    return res
      .status(200)
      .json({ sala: db[salaIndex], user: numeroDeUsuariosNaSala + 1 });
  }
}
