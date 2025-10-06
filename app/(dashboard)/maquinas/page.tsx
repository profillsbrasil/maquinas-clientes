'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { GridPatternBg } from '@/components/gridPatternBg';
import { Button } from '@/components/ui/button';

import MaquinasData from './[maquinaId]/_components/MaquinasData';

export default function MaquinasPage() {
  const router = useRouter();
  return (
    <main className='flex-1 p-5 h-full w-full'>
      <div className='mx-auto h-full w-full flex flex-col '>
        <div className='mb-4'>
          <h1 className='text-3xl font-bold '>Máquinas</h1>
          <p className='text-muted-foreground'>Lista de máquinas disponíveis</p>
        </div>
        <div className='grid grid-cols-4 gap-6'>
          {MaquinasData.map((maquina) => (
            <Link href={`/maquinas/${maquina.id}`} key={maquina.id}>
              <div
                key={maquina.id}
                className='flex relative flex-col hover:scale-101 transition-all duration-300 items-center border border-slate-900 shadow-md rounded-sm  justify-center max-h-100 bg-muted'>
                <GridPatternBg />
                <div className='flex h-75 px-4 py-2 w-full z-10'>
                  <Image
                    src={maquina.image}
                    alt={maquina.name}
                    className='w-full h-full object-contain'
                  />
                </div>
                <div className='flex-1 h-25 px-4 pb-4 w-full text-center space-y-2 z-10'>
                  <h2 className='text-2xl font-bold'>{maquina.name}</h2>
                  <Button
                    variant='outline'
                    onClick={() => router.push(`/maquinas/${maquina.id}`)}
                    className='w-full bg-slate-800 rounded-sm text-white hover:bg-slate-800/90 hover:text-white'>
                    Ver detalhes
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
