'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import CardMaquina from './_components/CardMaquina';
import MaquinasSkeletonGrid from './_components/MaquinasSkeletonGrid';
import { useMaquinas } from './_hooks/useMaquinas';
import { Plus } from 'lucide-react';

export default function MaquinasPage() {
  const { data: maquinas, isLoading, error } = useMaquinas();

  return (
    <main className='flex-1 p-5 h-full w-full bg-muted'>
      <div className='mx-auto h-full w-full flex flex-col'>
        {/* Header */}
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Máquinas Cadastradas</h1>
            <p className='text-muted-foreground'>
              Todas as máquinas criadas no sistema
            </p>
          </div>
          <Link href='/adicionar-maquina'>
            <Button className='bg-slate-800 hover:bg-slate-700 text-white rounded-sm'>
              <Plus className='w-4 h-4 mr-2' />
              Nova Máquina
            </Button>
          </Link>
        </div>

        {/* Loading */}
        {isLoading && <MaquinasSkeletonGrid />}

        {/* Erro */}
        {error && (
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center space-y-4'>
              <div className='text-6xl'>⚠️</div>
              <h2 className='text-2xl font-bold'>Erro ao carregar máquinas</h2>
              <p className='text-muted-foreground'>
                {error instanceof Error ? error.message : 'Erro desconhecido'}
              </p>
            </div>
          </div>
        )}

        {/* Vazio */}
        {!isLoading && !error && maquinas && maquinas.length === 0 && (
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center space-y-4'>
              <div className='text-6xl'>🏭</div>
              <h2 className='text-2xl font-bold'>Nenhuma máquina cadastrada</h2>
              <p className='text-muted-foreground max-w-md'>
                Comece criando sua primeira máquina e adicionando peças nela.
              </p>
              <Link href='/adicionar-maquina'>
                <Button className='bg-green-600 hover:bg-green-700 text-white mt-4 rounded-sm'>
                  <Plus className='w-4 h-4 mr-2' />
                  Criar Primeira Máquina
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Grid de máquinas */}
        {!isLoading && !error && maquinas && maquinas.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {maquinas.map((maquina) => (
              <CardMaquina
                key={maquina.id}
                id={maquina.id}
                nome={maquina.nome}
                imagem={maquina.imagem}
                totalPecas={maquina.totalPecas}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
