import { account } from './account';
import { maquina_cliente } from './maquina_cliente';
import { peca_maquina } from './peca_maquina';
import { pecas } from './pecas';
import { session } from './session';
import { user } from './user';
import { verification } from './verification';

export const schema = {
  user,
  session,
  account,
  verification,
  maquina_cliente,
  peca_maquina,
  pecas
};
