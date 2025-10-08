'use client';

import { useState } from 'react';

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
import { ScrollArea } from '@/components/ui/scroll-area';

import { Trash2 } from 'lucide-react';

type PecaLocalType = {
  localizacao: number;
  pecaId: string;
  nome: string;
  linkLoja: string;
};

type ListaPecasMaquinaProps = {
  pecas: PecaLocalType[];
  onRemover: (localizacao: number) => void;
};

export default function ListaPecasMaquina({
  pecas,
  onRemover
}: ListaPecasMaquinaProps) {
  const [pecaParaRemover, setPecaParaRemover] = useState<{
    localizacao: number;
    nome: string;
  } | null>(null);

  function handleConfirmarRemocao() {
    if (pecaParaRemover) {
      onRemover(pecaParaRemover.localizacao);
      setPecaParaRemover(null);
    }
  }

  if (pecas.length === 0) {
    return (
      <ScrollArea className='max-h-100 w-[30rem] p-4 bg-slate-800 text-white rounded-sm'>
        <div className='flex flex-col gap-2 w-full justify-center items-center'>
          <span className='text-muted-foreground'>Nenhuma peça adicionada</span>
        </div>
      </ScrollArea>
    );
  }

  return (
    <>
      <ScrollArea className='max-h-100 w-[30rem] p-4 bg-slate-800 text-white rounded-sm'>
        <div className='flex flex-col gap-2 w-full'>
          {pecas.map((item) => (
            <div
              key={item.localizacao}
              className='flex items-center gap-2 w-full justify-between p-2 bg-slate-700 rounded-sm hover:bg-slate-600'>
              <div className='flex flex-col gap-1'>
                <span className='font-medium'>{item.nome}</span>
                <span className='text-xs text-slate-300'>
                  Quadrado {item.localizacao}
                </span>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  setPecaParaRemover({
                    localizacao: item.localizacao,
                    nome: item.nome
                  })
                }
                className='hover:bg-slate-700 rounded-sm'>
                <Trash2 className='w-4 h-4 text-red-400' />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <AlertDialog
        open={!!pecaParaRemover}
        onOpenChange={(open) => !open && setPecaParaRemover(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Peça</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a peça "{pecaParaRemover?.nome}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='rounded-sm'>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarRemocao}
              className='bg-red-600 hover:bg-red-700 rounded-sm'>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
