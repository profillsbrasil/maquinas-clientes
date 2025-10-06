'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

import type { Maquina } from '../../../_components/types';
import { ChevronLeft, ChevronRight, Eye, Settings, Store } from 'lucide-react';

interface TpProps {
  maquina: Maquina;
}

export default function Tp({ maquina }: TpProps) {
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  const handleTogglePopover = (index: number) => {
    setOpenPopoverIndex(openPopoverIndex === index ? null : index);
  };

  return (
    <div className='mx-auto h-full w-full flex flex-col gap-4'>
      <div className='flex  w-full h-full justify-evenly'>
        <div className='relative w-1/2 h-full'>
          <Image
            src={maquina.image}
            alt={maquina.name}
            className='absolute top-0 left-0 w-full h-full object-contain'
          />
          {maquina.pecas.map((peca, index) => (
            <Popover
              key={index}
              open={openPopoverIndex === index}
              onOpenChange={(open) => setOpenPopoverIndex(open ? index : null)}>
              <PopoverTrigger
                className={`absolute size-8 flex justify-center items-center z-10 rounded-full bg-slate-800/40 text-white hover:bg-slate-800/90 ${peca.localizacaoClassName}`}>
                <Eye className='w-4 h-4' />
              </PopoverTrigger>
              <PopoverContent
                align={index === 0 ? 'start' : 'end'}
                className='bg-slate-800/90 w-full text-white text-center border-none'>
                <p className='mb-2'>{peca.nome}</p>
                <Button
                  asChild
                  className='w-full bg-slate-800 border-border/20 border hover:bg-slate-800/90'>
                  <Link href={peca.linkLoja} target='_blank'>
                    <Store className='w-4 h-4' /> Ver na Loja
                  </Link>
                </Button>
              </PopoverContent>
            </Popover>
          ))}
        </div>
        <div className='flex flex-col gap-4 w-[30rem] h-full pt-20'>
          <div>
            <h2 className='text-2xl font-bold'>Lista de Peças</h2>
            <p className='text-muted-foreground'>
              Peças presentes na sua máquina
            </p>
          </div>
          <ScrollArea className='max-h-100 w-[22rem] p-4 bg-slate-800 text-white rounded-md'>
            <div className='flex flex-col gap-2 w-full'>
              {maquina.pecas.map((peca, index) => (
                <Button
                  key={index}
                  onClick={() => handleTogglePopover(index)}
                  className={`flex items-center gap-2 w-full justify-start hover:bg-slate-700 hover:text-white ${
                    openPopoverIndex === index ? 'bg-slate-700' : ''
                  }`}
                  variant='ghost'>
                  <Settings className='w-4 h-4' />
                  <span>{peca.nome}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className='w-full relative h-20 bg-slate-900 flex items-center justify-between'>
        <div className='flex items-center justify-center h-full'>
          <Link
            href='/maquinas'
            className=' h-full flex items-center justify-center'>
            <Button
              variant='outline'
              className='w-full rounded-none h-full hover:bg-slate-700/90 hover:text-white flex items-center justify-center bg-slate-800 text-white border-border/20'>
              <ChevronLeft className='size-6' />
            </Button>
          </Link>
          <h1 className='text-2xl font-bold w-full h-full flex items-center text-white px-10'>
            Maquina: {maquina.name}
          </h1>
        </div>
        <Link
          href='/maquinas'
          className=' h-full flex items-center justify-center'>
          <Button
            variant='outline'
            className='w-full rounded-none h-full hover:bg-slate-700/90 hover:text-white flex items-center justify-center bg-slate-800 text-white border-border/20'>
            <ChevronRight className='size-6' />
          </Button>
        </Link>
      </div>
    </div>
  );
}
