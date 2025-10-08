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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { deletarPeca } from '../_actions/pecas';
import FormularioPeca from './FormularioPeca';
import { Edit, Store, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type PecaType = {
  id: number;
  nome: string;
  linkLojaIntegrada: string;
  createdAt: Date;
  updatedAt: Date;
};

type ListaPecasProps = {
  pecas: PecaType[];
};

export default function ListaPecas({ pecas: pecasIniciais }: ListaPecasProps) {
  const [pecaParaEditar, setPecaParaEditar] = useState<PecaType | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [pecaParaDeletar, setPecaParaDeletar] = useState<{
    id: number;
    nome: string;
  } | null>(null);

  async function handleConfirmarDeletar() {
    if (!pecaParaDeletar) return;

    const result = await deletarPeca(pecaParaDeletar.id);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setPecaParaDeletar(null);
  }

  function handleEditar(peca: PecaType) {
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
            <CardContent className='flex w-full justify-between '>
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
                  className='bg-slate-800 hover:bg-slate-700 border-none'
                  onClick={() => handleEditar(peca)}>
                  <Edit className='h-4 w-4 text-white ' />
                </Button>

                <Button
                  variant='destructive'
                  size='sm'
                  className='border-none'
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
              Tem certeza que deseja deletar a peça "{pecaParaDeletar?.nome}"?
              Esta ação não pode ser desfeita.
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
