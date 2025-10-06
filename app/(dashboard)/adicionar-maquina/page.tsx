'use client';

import Image from 'next/image';
import Link from 'next/link';

import MaquinaTp from '@/assets/images/maquinas/TP85.png';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ChevronLeft, ChevronRight, Plus, Settings, X } from 'lucide-react';

export default function AdicionarMaquinaPage() {
  return (
    <div className='flex-1 h-full w-full'>
      <div className='mx-auto h-full w-full flex flex-col gap-4'>
        <div className='flex gap-4 w-full h-full justify-evenly'>
          <div className='relative w-1/2'>
            <Image
              src={MaquinaTp}
              alt='Máquina TP'
              className='w-full h-full object-contain'
            />
            <div className='absolute  top-0 left-0 w-full h-full  grid grid-cols-30 hover:cursor-pointer '>
              {Array.from({ length: 600 }).map((_, index) => (
                <span
                  key={index}
                  className='text-white group border hover:bg-slate-800/50 flex items-center justify-center'>
                  <Plus className='w-4 h-4 text-transparent group-hover:text-white' />
                </span>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-4 max-w-[30rem] pt-30'>
            <div>
              <h2 className='text-2xl font-bold'>Lista de Peças</h2>
              <p className='text-muted-foreground'>
                Peças presentes na sua máquina
              </p>
            </div>
            <ScrollArea className='max-h-100 h-50 w-[30rem] p-4 bg-slate-800 text-white rounded-md'>
              <div className='flex flex-col gap-2 w-full justify-center items-center'>
                <Button
                  className={`flex   items-center gap-2 w-full justify-start hover:bg-slate-700 hover:text-white bg-slate-700`}
                  variant='ghost'>
                  <Settings className='w-4 h-4' />
                  <span>Peca 1</span>
                </Button>

                <Button
                  className={`flex items-center gap-2 w-10 justify-center hover:bg-slate-700 hover:text-white bg-slate-700`}
                  variant='ghost'>
                  <Plus className='w-4 h-4' />
                </Button>
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className='w-full relative h-16 bg-slate-900 flex items-center justify-between'>
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
              Maquina: TP85
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
    </div>
  );
}
