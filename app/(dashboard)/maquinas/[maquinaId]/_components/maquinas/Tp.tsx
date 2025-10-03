import Image from 'next/image';

import tp from '@/assets/images/maquinas/TP85.png';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Eye } from 'lucide-react';

export default function Tp({ maquinaId }: { maquinaId: string }) {
  return (
    <div className='mx-auto  h-full w-full flex flex-col gap-4 '>
      <h1 className='text-3xl font-bold mb-4'>Máquina {maquinaId}</h1>
      <div className='flex  gap-4 w-full h-full justify-evenly items-ce'>
        <div className='relative flex flex-col gap-4 w-1/2 h-full'>
          <Image
            src={tp}
            alt='Máquina'
            className='w-full h-full object-contain'
          />
          <Popover>
            <PopoverTrigger className='absolute top-52 size-8 justify-center items-center flex right-67 z-10 rounded-full bg-slate-800/40 border-none text-white hover:bg-slate-800/90 hover:text-white'>
              <Eye className='w-4 h-4' />
            </PopoverTrigger>
            <PopoverContent
              align='start'
              className='border-none text-white bg-slate-800/90 '>
              Botão de Liga/Desliga
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger className='absolute bottom-40 size-8 justify-center items-center flex right-1/2 z-10 rounded-full bg-slate-800/40 border-none text-white hover:bg-slate-800/90 hover:text-white'>
              <Eye className='w-4 h-4' />
            </PopoverTrigger>
            <PopoverContent
              align='start'
              className='border-none text-white bg-slate-800/90 '>
              Controlador de Velocidade do Motor
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-col gap-4 pt-30'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl font-bold'>Lista de Peças</h2>
            <p className='text-muted-foreground'>
              Peças presentes na sua máquina
            </p>
          </div>
          <ScrollArea className='max-h-100 w-[30rem] rounded-md gap-4 flex flex-col p-4 bg-slate-800 text-white'>
            <div className='flex flex-col gap-2 h-full w-full'>
              <div className='flex items-center gap-2'>
                <Checkbox />
                <p>Botão de Liga/Desliga</p>
              </div>
              <div className='flex items-center gap-2'>
                <Checkbox />
                <p>Controlador de Velocidade do Motor</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
