'use client';

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
  function handleRemover(localizacao: number, nome: string) {
    if (!confirm(`Remover a peça "${nome}"?`)) {
      return;
    }

    onRemover(localizacao);
  }

  if (pecas.length === 0) {
    return (
      <ScrollArea className='max-h-100 w-[30rem] p-4 bg-slate-800 text-white rounded-md'>
        <div className='flex flex-col gap-2 w-full justify-center items-center'>
          <span className='text-muted-foreground'>Nenhuma peça adicionada</span>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className='max-h-100 w-[30rem] p-4 bg-slate-800 text-white rounded-md'>
      <div className='flex flex-col gap-2 w-full'>
        {pecas.map((item) => (
          <div
            key={item.localizacao}
            className='flex items-center gap-2 w-full justify-between p-2 bg-slate-700 rounded hover:bg-slate-600'>
            <div className='flex flex-col gap-1'>
              <span className='font-medium'>{item.nome}</span>
              <span className='text-xs text-muted-foreground'>
                Localização: Quadrado {item.localizacao}
              </span>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleRemover(item.localizacao, item.nome)}
              className='hover:bg-red-600/20'>
              <Trash2 className='w-4 h-4 text-red-400' />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
