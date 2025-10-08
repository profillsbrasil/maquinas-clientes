'use client';

import { use } from 'react';

import { useMaquina } from '../_hooks/useMaquinas';
import MaquinaSkeletonVisualizar from './_components/MaquinaSkeletonVisualizar';
import MaquinaVisualizar from './_components/MaquinaVisualizar';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function MaquinaPage({ params }: Props) {
  const { id } = use(params);
  const idNumerico = parseInt(id, 10);

  const { data: maquina, isLoading, error } = useMaquina(idNumerico);

  if (isLoading) {
    return (
      <main className='flex-1 h-full w-full'>
        <MaquinaSkeletonVisualizar />
      </main>
    );
  }

  if (error || !maquina) {
    return (
      <main className='flex-1 h-full w-full flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='text-6xl'>⚠️</div>
          <h2 className='text-2xl font-bold'>Máquina não encontrada</h2>
          <p className='text-muted-foreground'>
            {error instanceof Error
              ? error.message
              : 'Erro ao carregar máquina'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className='flex-1 h-full w-full'>
      <MaquinaVisualizar maquina={maquina} />
    </main>
  );
}
