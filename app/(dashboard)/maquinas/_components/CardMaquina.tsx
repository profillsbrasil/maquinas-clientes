'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { GridPatternBg } from '@/components/gridPatternBg';
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

import { deletarMaquina } from '../_actions/listar-maquinas';
import { Edit, Eye, Package, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type CardMaquinaProps = {
  id: string;
  nome: string;
  imagem: string;
  totalPecas: number;
  onDelete: () => void;
};

export default function CardMaquina({
  id,
  nome,
  imagem,
  totalPecas,
  onDelete
}: CardMaquinaProps) {
  const router = useRouter();
  const [mostrarAlertaDeletar, setMostrarAlertaDeletar] = useState(false);

  async function handleConfirmarDeletar() {
    const result = await deletarMaquina(id);

    if (result.success) {
      toast.success(result.message);
      onDelete();
    } else {
      toast.error(result.message);
    }

    setMostrarAlertaDeletar(false);
  }

  function handleDeletar(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setMostrarAlertaDeletar(true);
  }

  function handleEditar(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/adicionar-maquina?id=${id}`);
  }

  function handleVisualizar(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/maquinas/${id}`);
  }

  return (
    <>
      <div className='flex relative flex-col hover:scale-101 transition-all duration-300 items-center border border-slate-900 shadow-md rounded-sm justify-center bg-muted group'>
        <GridPatternBg />

        {/* Imagem */}
        <div className='flex h-75 px-4 py-2 w-full z-10 relative'>
          <Image
            src={imagem}
            alt={nome}
            width={400}
            height={400}
            className='w-full h-full object-contain'
          />
          {totalPecas > 0 && (
            <div className='absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium'>
              <Package className='w-4 h-4' />
              {totalPecas}
            </div>
          )}
        </div>

        {/* Informações */}
        <div className='flex-1 h-25 px-4 pb-4 w-full text-center space-y-2 z-10'>
          <h2 className='text-2xl font-bold truncate'>{nome}</h2>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={handleVisualizar}
              className='flex-1 bg-slate-800 rounded-sm text-white hover:bg-slate-800/90 hover:text-white'>
              <Eye className='w-4 h-4 mr-2' />
              Ver
            </Button>
            <Button
              variant='outline'
              onClick={handleEditar}
              className='flex-1 bg-blue-600 rounded-sm text-white hover:bg-blue-700 hover:text-white'>
              <Edit className='w-4 h-4 mr-2' />
              Editar
            </Button>
            <Button
              variant='outline'
              onClick={handleDeletar}
              className='bg-red-600 rounded-sm text-white hover:bg-red-700 hover:text-white'>
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={mostrarAlertaDeletar}
        onOpenChange={setMostrarAlertaDeletar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Máquina</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a máquina "{nome}"? Esta ação não
              pode ser desfeita e todas as peças associadas serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='rounded-sm'>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarDeletar}
              className='bg-red-600 hover:bg-red-700 rounded-sm'>
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
