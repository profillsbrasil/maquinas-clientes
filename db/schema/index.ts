import { account } from './account';
import { session } from './session';
import { maquina } from './user/maquina';
import { peca } from './user/peca';
import { user } from './user/user';
import { verification } from './verification';

export const schema = {
  user,
  session,
  account,
  verification,
  maquina,
  peca
};
