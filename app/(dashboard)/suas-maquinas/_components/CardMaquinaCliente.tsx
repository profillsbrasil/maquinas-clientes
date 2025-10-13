'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

import { suasMaquinasKeys } from '../../../../lib/hooks/useSuasMaquinas';
import { buscarSuaMaquina } from '../_actions/listar-suas-maquinas';
import { Eye, Package } from 'lucide-react';

type Props = {
  id: number;
  nome: string;
  imagem: string;
  totalPecas: number;
};

export default function CardMaquinaCliente({
  id,
  nome,
  imagem,
  totalPecas
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Prefetch ao hover para carregamento instantâneo
  function handlePrefetch() {
    queryClient.prefetchQuery({
      queryKey: suasMaquinasKeys.detail(id),
      queryFn: async () => {
        const result = await buscarSuaMaquina(id);
        if (!result.success || !result.data) {
          throw new Error(result.message);
        }
        return result.data;
      },
      staleTime: 1000 * 60 * 5 // 5 minutos
    });
  }

  return (
    <div
      onClick={() => router.push(`/suas-maquinas/${id}`)}
      onMouseEnter={handlePrefetch}
      className='flex relative bg-background flex-col hover:scale-101 transition-all duration-300 items-center border border-slate-900 shadow-md rounded-sm justify-center cursor-pointer group'>
      {/* Imagem */}
      <div className='flex h-75 px-4 py-2 w-full z-10 relative'>
        <div className='relative w-full h-full'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagem}
            alt={nome}
            className='w-full h-full object-contain'
            loading='lazy'
            decoding='async'
          />
        </div>
        {totalPecas > 0 && (
          <div className='absolute top-4 right-4 bg-slate-800 text-white px-3 py-1 rounded-sm flex items-center gap-2 text-sm font-medium'>
            <Package className='w-4 h-4' />
            {totalPecas}
          </div>
        )}
      </div>

      {/* Informações */}
      <div className='flex-1 h-25 border-t border-slate-900 px-4 pb-4 pt-2 w-full text-center space-y-2 z-10'>
        <h2 className='text-xl font-bold truncate'>{nome}</h2>

        <Button
          variant='outline'
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/suas-maquinas/${id}`);
          }}
          className='w-full bg-slate-800 rounded-sm text-white hover:bg-slate-800/90 hover:text-white'>
          <Eye className='w-4 h-4 mr-2' />
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
}
