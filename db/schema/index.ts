import { account } from './account';
import { maquinas } from './maquinas';
import { pecas } from './pecas';
import { pecasNaMaquina } from './pecas_na_maquina';
import {
  maquinasRelations,
  pecasNaMaquinaRelations,
  pecasRelations,
  userMaquinasRelations,
  userRelations
} from './relations';
import { session } from './session';
import { user } from './user';
import { userMaquinas } from './user_maquinas';
import { verification } from './verification';

export const schema = {
  user,
  userRelations,
  userMaquinas,
  userMaquinasRelations,
  session,
  account,
  verification,
  pecas,
  pecasRelations,
  maquinas,
  maquinasRelations,
  pecasNaMaquina,
  pecasNaMaquinaRelations
};
