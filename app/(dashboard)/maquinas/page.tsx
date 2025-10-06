'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { listarTodasMaquinas } from './_actions/listar-maquinas';
import CardMaquina from './_components/CardMaquina';
import { Plus } from 'lucide-react';

type Maquina = {
  id: string;
  nome: string;
  imagem: string;
  criadoEm: Date;
  alteradoEm: Date;
  totalPecas: number;
};

export default function MaquinasPage() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMaquinas();
  }, []);

  async function carregarMaquinas() {
    setLoading(true);
    const result = await listarTodasMaquinas();
    if (result.success && result.data) {
      setMaquinas(result.data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <main className='flex-1 p-5 h-full w-full flex items-center justify-center'>
        <div className='text-xl'>Carregando máquinas...</div>
      </main>
    );
  }

  if (maquinas.length === 0) {
    return (
      <main className='flex-1 p-5 h-full w-full'>
        <div className='mx-auto h-full w-full flex flex-col'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>Máquinas Cadastradas</h1>
              <p className='text-muted-foreground'>
                Todas as máquinas criadas no sistema
              </p>
            </div>
            <Link href='/adicionar-maquina'>
              <Button className='bg-green-600 hover:bg-green-700 text-white'>
                <Plus className='w-4 h-4 mr-2' />
                Nova Máquina
              </Button>
            </Link>
          </div>

          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center space-y-4'>
              <div className='text-6xl'>🏭</div>
              <h2 className='text-2xl font-bold'>Nenhuma máquina cadastrada</h2>
              <p className='text-muted-foreground max-w-md'>
                Comece criando sua primeira máquina e adicionando peças nela.
              </p>
              <Link href='/adicionar-maquina'>
                <Button className='bg-green-600 hover:bg-green-700 text-white mt-4'>
                  <Plus className='w-4 h-4 mr-2' />
                  Criar Primeira Máquina
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='flex-1 p-5 h-full w-full'>
      <div className='mx-auto h-full w-full flex flex-col'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Máquinas Cadastradas</h1>
            <p className='text-muted-foreground'>
              {maquinas.length} {maquinas.length === 1 ? 'máquina' : 'máquinas'}{' '}
              no sistema
            </p>
          </div>
          <Link href='/adicionar-maquina'>
            <Button className='bg-green-600 hover:bg-green-700 text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Nova Máquina
            </Button>
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {maquinas.map((maquina) => (
            <CardMaquina
              key={maquina.id}
              id={maquina.id}
              nome={maquina.nome}
              imagem={maquina.imagem}
              totalPecas={maquina.totalPecas}
              onDelete={carregarMaquinas}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
