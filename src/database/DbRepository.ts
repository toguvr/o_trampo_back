import { Room } from '@modules/room/dtos/ICreateRoomDTO';
import AppError from '@shared/errors/AppError';
import fs from 'fs';
import path from 'path';
import db from './db.json';

export const dbFolder = path.resolve(__dirname, 'db.json');

export function getDb(): Room[] {
  return db;
}

export function findRoom(sala_id: string): Room | undefined {
  const room = getDb().find(sala => {
    return String(sala.id) === String(sala_id);
  });

  return room;
}

export function findRoomIndex(sala_id: string): number {
  const roomIndex = getDb().findIndex(sala => {
    return String(sala.id) === String(sala_id);
  });

  return roomIndex;
}

export async function writeDb(data: Room[]) {
  const stringfyJsonData = JSON.stringify(data, null, 2);

  fs.writeFile(dbFolder, stringfyJsonData, function (err) {
    if (err) {
      throw new AppError('Erro ao gravar dados.');
    }
    return data;
  });
}
