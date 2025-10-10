'use client';

import { use } from 'react';

import { useSuaMaquina } from '../_hooks/useSuasMaquinas';
import MaquinaSkeletonVisualizar from './_components/MaquinaSkeletonVisualizar';
import MaquinaVisualizar from './_components/MaquinaVisualizar';

interface Props {
  params: Promise<{
    maquinaId: string;
  }>;
}

export default function SuaMaquinaPage({ params }: Props) {
  const { maquinaId } = use(params);
  const idNumerico = parseInt(maquinaId, 10);

  const { data: maquina, isLoading, error } = useSuaMaquina(idNumerico);

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
              : 'Erro ao carregar máquina ou você não tem acesso a ela'}
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
