'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ChevronLeft, Eye, Headset, Settings, Store } from 'lucide-react';

type Peca = {
  id: number;
  pecaId: number;
  nome: string;
  linkLojaIntegrada: string;
  localizacao: number;
};

type Props = {
  maquina: {
    id: number;
    nome: string;
    imagem: string;
    pecas: Peca[];
  };
};

export default function MaquinaVisualizar({ maquina }: Props) {
  const [popoverAberto, setPopoverAberto] = useState<number | null>(null);

  const pecasPorLocalizacao = useMemo(
    () => new Map(maquina.pecas.map((peca) => [peca.localizacao, peca])),
    [maquina.pecas]
  );

  return (
    <div className='mx-auto h-[calc(100vh-64px)] w-full flex flex-col'>
      <div className='flex gap-4 w-full flex-1 justify-evenly overflow-hidden'>
        {/* Área da imagem */}
        <div className='relative w-1/2 h-full flex items-center justify-center p-4'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={maquina.imagem}
            alt={maquina.nome}
            className='w-full h-full object-contain'
            loading='eager'
            decoding='async'
          />

          {/* Grid de peças */}
          <div className='absolute top-0 left-0 w-full h-full grid grid-cols-30 p-4 pointer-events-none'>
            {Array.from({ length: 600 }).map((_, index) => {
              const peca = pecasPorLocalizacao.get(index);
              if (!peca)
                return <div key={index} className='pointer-events-none' />;

              const pecaIndex = maquina.pecas.findIndex(
                (p) => p.localizacao === index
              );

              return (
                <div
                  key={index}
                  className='flex items-center justify-center pointer-events-auto'>
                  <Popover
                    open={popoverAberto === pecaIndex}
                    onOpenChange={(open) =>
                      setPopoverAberto(open ? pecaIndex : null)
                    }>
                    <PopoverTrigger className='h-8 min-w-8 flex justify-center items-center z-10 rounded-full bg-slate-800/40 text-white hover:bg-slate-800/90 transition-colors'>
                      <Eye className='size-5' />
                    </PopoverTrigger>
                    <PopoverContent
                      align='center'
                      className='bg-slate-800/90 w-full text-white text-center border-none min-w-60'>
                      <p className='mb-2'>{peca.nome}</p>
                      <Link href={peca.linkLojaIntegrada} target='_blank'>
                        <Button className='w-full bg-slate-800 border-border/20 border hover:bg-slate-800/90'>
                          <Store className='w-4 h-4' /> Ver na Loja
                        </Button>
                      </Link>
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista de peças */}
        <div className='flex flex-col w-[30rem] pt-30 justify-start items-start'>
          <div className='flex flex-col py-4 w-full justify-start items-start'>
            <h2 className='text-2xl font-bold'>Lista de Peças</h2>
            <p className='text-muted-foreground'>
              Peças presentes na máquina ({maquina.pecas.length})
            </p>
          </div>
          <ScrollArea className='max-h-100 max-w-[30rem] min-w-[20rem] p-4 bg-slate-800 text-white rounded-sm'>
            <div className='flex flex-col gap-2 w-full'>
              {maquina.pecas.length === 0 ? (
                <div className='text-center text-muted-foreground py-8'>
                  Nenhuma peça cadastrada
                </div>
              ) : (
                maquina.pecas.map((peca, index) => (
                  <Button
                    key={peca.id}
                    onClick={() =>
                      setPopoverAberto(popoverAberto === index ? null : index)
                    }
                    className={`flex items-center gap-2 w-full justify-start hover:bg-slate-700 hover:text-white ${
                      popoverAberto === index ? 'bg-slate-700' : ''
                    }`}
                    variant='ghost'>
                    <Settings className='w-4 h-4' />
                    <span className='truncate'>{peca.nome}</span>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Rodapé */}
      <div className='w-full relative h-14 bg-slate-900 flex items-center justify-between'>
        <div className='flex w-1/2 items-center justify-center h-full gap-10'>
          <Link
            href='/suas-maquinas'
            className='h-full flex items-center justify-center'>
            <Button
              variant='outline'
              className='w-full rounded-none h-full !border-x hover:bg-slate-700/90 hover:text-white flex items-center justify-center bg-slate-800 text-white border-border/10'>
              <ChevronLeft className='size-6' />
            </Button>
          </Link>
          <h1 className='text-xl font-bold w-full h-full flex items-center text-white'>
            Máquina: {maquina.nome}
          </h1>
        </div>
        <div className='flex w-1/2 h-full justify-end items-center'>
          <Button
            variant='outline'
            onClick={() => {
              // TODO: Integrar WhatsApp
              alert('Solicitar Auxílio');
            }}
            className='h-14 min-w-48 rounded-none hover:bg-slate-700/90 hover:text-white border-x bg-slate-800 text-white border-border/10'>
            <Headset className='w-4 h-4 mr-2' /> Solicitar Auxílio
          </Button>
        </div>
      </div>
    </div>
  );
}
