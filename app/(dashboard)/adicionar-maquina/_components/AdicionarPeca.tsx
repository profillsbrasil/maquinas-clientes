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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Plus, Store } from 'lucide-react';

const pecas: { id: number; nome: string; linkLoja: string }[] = [
  {
    id: 1,
    nome: 'Peca 1',
    linkLoja: 'https://www.google.com'
  },
  {
    id: 2,
    nome: 'Peca 2',
    linkLoja: 'https://www.google.com'
  },

  {
    id: 3,
    nome: 'Peca 3',
    linkLoja: 'https://www.google.com'
  }
];

export default function AdicionarPeca() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className='text-white group border hover:bg-slate-800/50 flex items-center justify-center'>
          <Plus className='w-4 h-4 text-transparent group-hover:text-white' />
        </span>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Adicionar Uma Peça</DialogTitle>
          <DialogDescription>
            Adicione a peça na localização que selecionou
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <Select>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Selecione a peça' />
            </SelectTrigger>
            <SelectContent>
              {pecas.map((peca, index) => (
                <SelectItem key={index} value={peca.nome}>
                  {peca.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className='flex  gap-2'>
            <Input type='text' placeholder='Link da loja integrada' />

            {/* TODO: mudar para o link da loja integrada */}
            <Link
              href={pecas[0].linkLoja}
              target='_blank'
              className=' flex items-center justify-center size-8'>
              <Store className='w-4 h-4 text-black hover:text-black/80' />
            </Link>
          </div>
        </div>
        <DialogFooter className='sm:justify-end '>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Cancelar
            </Button>
          </DialogClose>
          <Button type='button' variant='default'>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
