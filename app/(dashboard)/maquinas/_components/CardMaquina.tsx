'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

import { buscarMaquina } from '../_actions/listar-maquinas';
import { maquinasKeys, useDeletarMaquina } from '../_hooks/useMaquinas';
import { Edit, Eye, Package, Trash2 } from 'lucide-react';

type Props = {
  id: number;
  nome: string;
  imagem: string;
  totalPecas: number;
};

export default function CardMaquina({ id, nome, imagem, totalPecas }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [alertaAberto, setAlertaAberto] = useState(false);
  const deletarMutation = useDeletarMaquina();

  // Prefetch ao hover para carregamento instantâneo
  function handlePrefetch() {
    queryClient.prefetchQuery({
      queryKey: maquinasKeys.detail(id),
      queryFn: async () => {
        const result = await buscarMaquina(id);
        if (!result.success || !result.data) {
          throw new Error(result.message);
        }
        return result.data;
      },
      staleTime: 1000 * 60 * 5 // 5 minutos
    });
  }

  function handleDeletar() {
    deletarMutation.mutate(id, {
      onSuccess: () => {
        setAlertaAberto(false);
      }
    });
  }

  return (
    <>
      <div
        onClick={() => router.push(`/maquinas/${id}`)}
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

          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/maquinas/${id}`);
              }}
              className='flex-1 bg-slate-800 rounded-sm text-white hover:bg-slate-800/90 hover:text-white'>
              <Eye className='w-4 h-4 mr-2' />
              Ver
            </Button>
            <Button
              variant='outline'
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/maquinas/editar-maquina/${id}`);
              }}
              className='flex-1 bg-slate-700 rounded-sm text-white hover:bg-slate-700/90 hover:text-white'>
              <Edit className='w-4 h-4 mr-2' />
              Editar
            </Button>
            <Button
              variant='outline'
              onClick={(e) => {
                e.stopPropagation();
                setAlertaAberto(true);
              }}
              disabled={deletarMutation.isPending}
              className='bg-red-700 rounded-sm text-white hover:bg-red-700/90 hover:text-white disabled:opacity-50'>
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={alertaAberto} onOpenChange={setAlertaAberto}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Máquina</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a máquina "{nome}"? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className='rounded-sm'
              disabled={deletarMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletar}
              disabled={deletarMutation.isPending}
              className='bg-red-600 hover:bg-red-700 rounded-sm disabled:opacity-50'>
              {deletarMutation.isPending ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
