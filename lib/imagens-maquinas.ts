import tc4s200 from '@/assets/images/maquinas/TC 4S 200-1.png';
import tp85 from '@/assets/images/maquinas/TP85.png';
import envasadoraFrascos from '@/assets/images/maquinas/envasadora-de-frascos-tubulares.png';
import envolvedora from '@/assets/images/maquinas/envolvedora.png';
import flowpack from '@/assets/images/maquinas/flowpack.png';
import garrafasTribloc from '@/assets/images/maquinas/garrafas-tribloc.png';
import maquinaBisnaga from '@/assets/images/maquinas/maquina-de-bisnaga.png';
import maquinaFumo from '@/assets/images/maquinas/maquina-de-fumo.png';
import maquinaGaloes from '@/assets/images/maquinas/maquina-de-galoes.png';
import maquinaGarrafaNormal from '@/assets/images/maquinas/maquina-de-garrafa-normal.png';
import maquinaMiniPouch from '@/assets/images/maquinas/maquina-mini-pouch.png';
import maquinaRotativa24b from '@/assets/images/maquinas/maquina-rotativa-24b.png';
import nimcoEditada from '@/assets/images/maquinas/nimco-editada.png';
import pouchPneumatica from '@/assets/images/maquinas/pouch-pneumatica-tc-sup-530.png';
import projetoSemTitulo from '@/assets/images/maquinas/projeto-sem-titulo-276.png';
import ptc3s from '@/assets/images/maquinas/ptc-3s.png';
import rotativaPotes from '@/assets/images/maquinas/rotativa-de-potes-calipo.png';
import standUpPouch from '@/assets/images/maquinas/stand-up-pouch-rotativa02.png';
import tc3s200Stick from '@/assets/images/maquinas/tc-3s-200-2-stick.png';
import tc3s350 from '@/assets/images/maquinas/tc-3s-350-1.png';
import tc3s600s from '@/assets/images/maquinas/tc-3s-600s.png';
import tc3sc200 from '@/assets/images/maquinas/tc-3sc-200-2.png';
import tc4s200_360 from '@/assets/images/maquinas/tc-4s-200-360-2.png';
import tc4s204_360 from '@/assets/images/maquinas/tc-4s-204-360-3.png';
import teste from '@/assets/images/maquinas/teste.png';

export type ImagemMaquina = {
  id: string;
  nome: string;
  src: any;
  url: string;
};

export const imagensMaquinas: ImagemMaquina[] = [
  {
    id: 'tp85',
    nome: 'TP85',
    src: tp85,
    url: '/assets/images/maquinas/TP85.png'
  },
  {
    id: 'envasadora-frascos',
    nome: 'Envasadora de Frascos Tubulares',
    src: envasadoraFrascos,
    url: '/assets/images/maquinas/envasadora-de-frascos-tubulares.png'
  },
  {
    id: 'envolvedora',
    nome: 'Envolvedora',
    src: envolvedora,
    url: '/assets/images/maquinas/envolvedora.png'
  },
  {
    id: 'flowpack',
    nome: 'Flowpack',
    src: flowpack,
    url: '/assets/images/maquinas/flowpack.png'
  },
  {
    id: 'garrafas-tribloc',
    nome: 'Garrafas Tribloc',
    src: garrafasTribloc,
    url: '/assets/images/maquinas/garrafas-tribloc.png'
  },
  {
    id: 'maquina-bisnaga',
    nome: 'Máquina de Bisnaga',
    src: maquinaBisnaga,
    url: '/assets/images/maquinas/maquina-de-bisnaga.png'
  },
  {
    id: 'maquina-fumo',
    nome: 'Máquina de Fumo',
    src: maquinaFumo,
    url: '/assets/images/maquinas/maquina-de-fumo.png'
  },
  {
    id: 'maquina-galoes',
    nome: 'Máquina de Galões',
    src: maquinaGaloes,
    url: '/assets/images/maquinas/maquina-de-galoes.png'
  },
  {
    id: 'maquina-garrafa-normal',
    nome: 'Máquina de Garrafa Normal',
    src: maquinaGarrafaNormal,
    url: '/assets/images/maquinas/maquina-de-garrafa-normal.png'
  },
  {
    id: 'maquina-mini-pouch',
    nome: 'Máquina Mini Pouch',
    src: maquinaMiniPouch,
    url: '/assets/images/maquinas/maquina-mini-pouch.png'
  },
  {
    id: 'maquina-rotativa-24b',
    nome: 'Máquina Rotativa 24B',
    src: maquinaRotativa24b,
    url: '/assets/images/maquinas/maquina-rotativa-24b.png'
  },
  {
    id: 'nimco-editada',
    nome: 'Nimco',
    src: nimcoEditada,
    url: '/assets/images/maquinas/nimco-editada.png'
  },
  {
    id: 'pouch-pneumatica',
    nome: 'Pouch Pneumática TC SUP 530',
    src: pouchPneumatica,
    url: '/assets/images/maquinas/pouch-pneumatica-tc-sup-530.png'
  },
  {
    id: 'projeto-sem-titulo',
    nome: 'Projeto Sem Título 276',
    src: projetoSemTitulo,
    url: '/assets/images/maquinas/projeto-sem-titulo-276.png'
  },
  {
    id: 'ptc-3s',
    nome: 'PTC 3S',
    src: ptc3s,
    url: '/assets/images/maquinas/ptc-3s.png'
  },
  {
    id: 'rotativa-potes',
    nome: 'Rotativa de Potes Calipo',
    src: rotativaPotes,
    url: '/assets/images/maquinas/rotativa-de-potes-calipo.png'
  },
  {
    id: 'stand-up-pouch',
    nome: 'Stand Up Pouch Rotativa',
    src: standUpPouch,
    url: '/assets/images/maquinas/stand-up-pouch-rotativa02.png'
  },
  {
    id: 'tc-4s-200',
    nome: 'TC 4S 200-1',
    src: tc4s200,
    url: '/assets/images/maquinas/TC 4S 200-1.png'
  },
  {
    id: 'tc-3s-200-stick',
    nome: 'TC 3S 200-2 Stick',
    src: tc3s200Stick,
    url: '/assets/images/maquinas/tc-3s-200-2-stick.png'
  },
  {
    id: 'tc-3s-350',
    nome: 'TC 3S 350-1',
    src: tc3s350,
    url: '/assets/images/maquinas/tc-3s-350-1.png'
  },
  {
    id: 'tc-3s-600s',
    nome: 'TC 3S 600S',
    src: tc3s600s,
    url: '/assets/images/maquinas/tc-3s-600s.png'
  },
  {
    id: 'tc-3sc-200',
    nome: 'TC 3SC 200-2',
    src: tc3sc200,
    url: '/assets/images/maquinas/tc-3sc-200-2.png'
  },
  {
    id: 'tc-4s-200-360',
    nome: 'TC 4S 200-360-2',
    src: tc4s200_360,
    url: '/assets/images/maquinas/tc-4s-200-360-2.png'
  },
  {
    id: 'tc-4s-204-360',
    nome: 'TC 4S 204-360-3',
    src: tc4s204_360,
    url: '/assets/images/maquinas/tc-4s-204-360-3.png'
  },
  {
    id: 'teste',
    nome: 'Teste',
    src: teste,
    url: '/assets/images/maquinas/teste.png'
  }
];
