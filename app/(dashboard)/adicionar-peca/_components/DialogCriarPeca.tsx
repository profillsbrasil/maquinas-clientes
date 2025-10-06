'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import FormularioPeca from './FormularioPeca';
import { Plus } from 'lucide-react';

export default function DialogCriarPeca() {
  const [dialogAberto, setDialogAberto] = useState(false);

  function handleFecharDialog() {
    setDialogAberto(false);
  }

  return (
    <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
      <DialogTrigger asChild>
        <Button className='gap-2 w-40 bg-slate-800 hover:bg-slate-700'>
          <Plus className='h-4 w-4' />
          Nova Peça
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Peça</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para cadastrar uma nova peça.
          </DialogDescription>
        </DialogHeader>
        <FormularioPeca onSuccess={handleFecharDialog} />
      </DialogContent>
    </Dialog>
  );
}
