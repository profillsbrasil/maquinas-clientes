'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useCriarPeca } from '../_hooks/useCriarPeca';
import { useEditarPeca } from '../_hooks/useEditarPeca';
import type { Peca } from '../_types';

type FormularioPecaProps = {
  pecaParaEditar?: Peca | null;
  onSuccess?: () => void;
};

export default function FormularioPeca({
  pecaParaEditar,
  onSuccess
}: FormularioPecaProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate: criarPeca, isPending: criando } = useCriarPeca();
  const { mutate: editarPeca, isPending: editando } = useEditarPeca();

  const isPending = criando || editando;

  // Preencher o formulário quando houver uma peça para editar
  useEffect(() => {
    if (pecaParaEditar && formRef.current) {
      const form = formRef.current;
      (form.elements.namedItem('nome') as HTMLInputElement).value =
        pecaParaEditar.nome;
      (form.elements.namedItem('linkLojaIntegrada') as HTMLInputElement).value =
        pecaParaEditar.linkLojaIntegrada;
    }
  }, [pecaParaEditar]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get('nome') as string,
      linkLojaIntegrada: formData.get('linkLojaIntegrada') as string
    };

    if (pecaParaEditar) {
      editarPeca(
        { id: pecaParaEditar.id, data },
        {
          onSuccess: () => {
            formRef.current?.reset();
            onSuccess?.();
          }
        }
      );
    } else {
      criarPeca(data, {
        onSuccess: () => {
          formRef.current?.reset();
          onSuccess?.();
        }
      });
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='nome'>Nome da Peça *</Label>
        <Input
          id='nome'
          name='nome'
          type='text'
          placeholder='Ex: Engrenagem Z100'
          required
          disabled={isPending}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='linkLojaIntegrada'>Link da Loja Integrada *</Label>
        <Input
          id='linkLojaIntegrada'
          name='linkLojaIntegrada'
          type='url'
          placeholder='https://exemplo.com/produto'
          required
          disabled={isPending}
        />
      </div>

      <Button type='submit' disabled={isPending} className='w-full'>
        {isPending
          ? 'Salvando...'
          : pecaParaEditar
            ? 'Atualizar Peça'
            : 'Criar Peça'}
      </Button>
    </form>
  );
}
