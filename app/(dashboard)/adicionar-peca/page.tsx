'use client';

import { Spinner } from '@/components/ui/spinner';

import DialogCriarPeca from './_components/DialogCriarPeca';
import ListaPecas from './_components/ListaPecas';
import { usePecas } from './_hooks/usePecas';

export default function AdicionarPecaPage() {
  const { data: pecas = [], isLoading, error } = usePecas();

  return (
    <main className='flex-1 p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Gerenciar Peças
            </h1>
            <p className='text-muted-foreground mt-2'>
              Gerencie todas as peças cadastradas no sistema
            </p>
          </div>

          <DialogCriarPeca />
        </div>

        {/* Lista de Peças */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Todas as Peças</h2>

          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Spinner className='size-8 text-slate-800' />
            </div>
          ) : error ? (
            <div className='text-center py-12 text-red-500'>
              Erro ao carregar peças. Tente novamente.
            </div>
          ) : (
            <ListaPecas pecas={pecas} />
          )}
        </div>
      </div>
    </main>
  );
}
