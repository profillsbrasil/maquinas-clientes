import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import MaquinasData from './_components/MaquinasData';

export default function MaquinasPage() {
  return (
    <main className='flex-1 p-6 h-full w-full'>
      <div className='mx-auto  h-full w-full flex flex-col gap-4 '>
        <div>
          <h1 className='text-3xl font-bold mb-4'>Máquinas</h1>
          <p className='text-muted-foreground'>
            Lista de máquinas será exibida aqui
          </p>
        </div>
        <div className='grid grid-cols-4 gap-6'>
          {/* Card da máquina */}

          <div className='flex flex-col items-center border border-border shadow-md rounded-md justify-center gap-4 max-h-100 bg-muted'>
            <div className='flex-1 h-75 p-4 w-full '>
              <Image
                src={MaquinasData[0].image}
                alt='Máquina'
                className='w-full h-full object-contain'
              />
            </div>
            <div className='flex-1 h-25  px-4 pb-4 w-full text-center space-y-2'>
              <h2 className='text-2xl font-bold '>Máquinas</h2>
              <Link href={`/maquinas/${MaquinasData[0].id}`}>
                <Button
                  variant='outline'
                  className='w-full bg-slate-800 text-white hover:bg-slate-800/90 hover:text-white'>
                  Ver detalhes
                </Button>
              </Link>
            </div>
          </div>
          {/* Card da máquina */}

          <div className='flex flex-col items-center border border-border shadow-md rounded-md justify-center gap-4 max-h-100 bg-muted'>
            <div className='flex-1 h-75 p-4 w-full '>
              <Image
                src={MaquinasData[1].image}
                alt='Máquina'
                className='w-full h-full object-contain'
              />
            </div>
            <div className='flex-1 h-25  px-4 pb-4 w-full text-center space-y-2'>
              <h2 className='text-2xl font-bold '>Máquinas</h2>
              <Link href={`/maquinas/${MaquinasData[1].id}`}>
                <Button
                  variant='outline'
                  className='w-full bg-slate-800 text-white hover:bg-slate-800/90 hover:text-white'>
                  Ver detalhes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
