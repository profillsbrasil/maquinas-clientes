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
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { useDeletarPeca } from '../_hooks/useDeletarPeca';
import type { Peca } from '../_types';
import FormularioPeca from './FormularioPeca';
import { Edit, Store, Trash2 } from 'lucide-react';

type ListaPecasProps = {
  pecas: Peca[];
};

export default function ListaPecas({ pecas: pecasIniciais }: ListaPecasProps) {
  const [pecaParaEditar, setPecaParaEditar] = useState<Peca | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [pecaParaDeletar, setPecaParaDeletar] = useState<{
    id: number;
    nome: string;
  } | null>(null);

  const { mutate: deletarPeca, isPending: deletando } = useDeletarPeca();

  function handleConfirmarDeletar() {
    if (!pecaParaDeletar) return;

    deletarPeca(pecaParaDeletar.id, {
      onSettled: () => {
        setPecaParaDeletar(null);
      }
    });
  }

  function handleEditar(peca: Peca) {
    setPecaParaEditar(peca);
    setDialogAberto(true);
  }

  function handleFecharDialog() {
    setDialogAberto(false);
    setPecaParaEditar(null);
  }

  if (pecasIniciais.length === 0) {
    return (
      <Card>
        <CardContent className='py-8 text-center text-muted-foreground'>
          Nenhuma peça cadastrada ainda.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {pecasIniciais.map((peca) => (
          <Card key={peca.id} className='rounded-sm'>
            <CardContent className='flex w-full justify-between  rounded-sm'>
              <div className='flex flex-col gap-2'>
                <h3 className='text-lg font-bold'>{peca.nome}</h3>
                <a
                  href={peca.linkLojaIntegrada}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
                  <Store className='h-4 w-4 ' />
                  Ver na Loja
                </a>
              </div>

              <div className='flex gap-2 flex-col justify-center items-center'>
                <Button
                  variant='outline'
                  size='sm'
                  className='bg-slate-800 hover:bg-slate-700 border-none rounded-sm'
                  onClick={() => handleEditar(peca)}>
                  <Edit className='h-4 w-4 text-white ' />
                </Button>

                <Button
                  variant='destructive'
                  size='sm'
                  className='border-none rounded-sm'
                  onClick={() =>
                    setPecaParaDeletar({ id: peca.id, nome: peca.nome })
                  }>
                  <Trash2 className='h-4 w-4 text-white' />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Peça</DialogTitle>
            <DialogDescription>
              Atualize as informações da peça abaixo.
            </DialogDescription>
          </DialogHeader>
          <FormularioPeca
            pecaParaEditar={pecaParaEditar}
            onSuccess={handleFecharDialog}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!pecaParaDeletar}
        onOpenChange={(open) => !open && setPecaParaDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Peça</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a peça &quot;
              {pecaParaDeletar?.nome}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='rounded-sm' disabled={deletando}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarDeletar}
              disabled={deletando}
              className='bg-red-600 hover:bg-red-700 rounded-sm'>
              {deletando ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
