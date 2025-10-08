'use client';

import { memo, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import type { Peca, PecaAdicionada } from '../_types';
import { Plus, Store, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

type AdicionarPecaProps = {
  localizacao: number;
  pecasDisponiveis: Peca[];
  pecaExistente?: Omit<PecaAdicionada, 'localizacao' | 'pecaId'> | null;
  onAdicionar: (localizacao: number, pecaId: number) => void;
  onRemover?: (localizacao: number) => void;
};

function AdicionarPeca({
  localizacao,
  pecasDisponiveis,
  pecaExistente,
  onAdicionar,
  onRemover
}: AdicionarPecaProps) {
  const [pecaSelecionada, setPecaSelecionada] = useState<string>('');
  const [dialogAberto, setDialogAberto] = useState(false);

  const pecaAtual = pecasDisponiveis.find(
    (p) => p.id.toString() === pecaSelecionada
  );

  function handleAdicionar() {
    if (!pecaSelecionada) {
      toast.error('Selecione uma peça');
      return;
    }

    onAdicionar(localizacao, parseInt(pecaSelecionada, 10));
    setDialogAberto(false);
    setPecaSelecionada('');
  }

  function handleRemover() {
    if (onRemover) {
      onRemover(localizacao);
      setDialogAberto(false);
    }
  }

  if (pecaExistente) {
    return (
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogTrigger asChild>
          <span className='bg-green-600/30 border border-green-600 flex items-center justify-center text-xs  text-white hover:bg-green-600/50 cursor-pointer'>
            <X className='size-4' />
          </span>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{pecaExistente.nome}</DialogTitle>
            <DialogDescription>Quadrado {localizacao}</DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-4'>
            <Link
              href={pecaExistente.linkLoja}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800'>
              <Store className='w-4 h-4' />
              Ver na Loja
            </Link>
          </div>
          <DialogFooter className='flex gap-2'>
            <DialogClose asChild>
              <Button type='button' variant='secondary' className='rounded-sm'>
                Fechar
              </Button>
            </DialogClose>
            {onRemover && (
              <Button
                type='button'
                variant='destructive'
                onClick={handleRemover}
                className='rounded-sm bg-red-600 hover:bg-red-700'>
                <Trash2 className='w-4 h-4 mr-2' />
                Remover Peça
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
      <DialogTrigger asChild>
        <span className='text-white group border hover:bg-slate-800/60 flex items-center justify-center'>
          <Plus className='w-4 h-4 text-transparent group-hover:text-white' />
        </span>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Adicionar Uma Peça</DialogTitle>
          <DialogDescription>Quadrado {localizacao}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <Select value={pecaSelecionada} onValueChange={setPecaSelecionada}>
            <SelectTrigger className='w-full rounded-sm'>
              <SelectValue
                placeholder='Selecione a peça'
                className='rounded-sm'
              />
            </SelectTrigger>
            <SelectContent className='rounded-sm'>
              {pecasDisponiveis.map((peca) => (
                <SelectItem key={peca.id.toString()} value={peca.id.toString()}>
                  {peca.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {pecaAtual && (
            <Link
              href={pecaAtual.linkLojaIntegrada}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800'>
              <Store className='w-4 h-4' />
              Ver na Loja Integrada
            </Link>
          )}
        </div>
        <DialogFooter className='sm:justify-end '>
          <DialogClose asChild>
            <Button type='button' variant='secondary' className='rounded-sm'>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type='button'
            variant='default'
            onClick={handleAdicionar}
            className='rounded-sm'>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Memoizar para evitar re-renders quando props não mudam
export default memo(AdicionarPeca);
