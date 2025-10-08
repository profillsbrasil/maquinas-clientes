'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { criarPeca, editarPeca } from '../_actions/pecas';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

type PecaType = {
  id: number;
  nome: string;
  linkLojaIntegrada: string;
};

type FormularioPecaProps = {
  pecaParaEditar?: PecaType | null;
  onSuccess?: () => void;
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} className='w-full'>
      {pending ? 'Salvando...' : isEditing ? 'Atualizar Peça' : 'Criar Peça'}
    </Button>
  );
}

export default function FormularioPeca({
  pecaParaEditar,
  onSuccess
}: FormularioPecaProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

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

  async function handleSubmit(formData: FormData) {
    setErrors({});

    const result = pecaParaEditar
      ? await editarPeca(pecaParaEditar.id, formData)
      : await criarPeca(formData);

    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
      onSuccess?.();
    } else {
      toast.error(result.message);
      if (result.errors) {
        setErrors(result.errors);
      }
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='nome'>Nome da Peça *</Label>
        <Input
          id='nome'
          name='nome'
          type='text'
          placeholder='Ex: Engrenagem Z100'
          required
          className={errors.nome ? 'border-red-500' : ''}
        />
        {errors.nome && (
          <p className='text-sm text-red-500'>{errors.nome[0]}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='linkLojaIntegrada'>Link da Loja Integrada *</Label>
        <Input
          id='linkLojaIntegrada'
          name='linkLojaIntegrada'
          type='url'
          placeholder='https://exemplo.com/produto'
          required
          className={errors.linkLojaIntegrada ? 'border-red-500' : ''}
        />
        {errors.linkLojaIntegrada && (
          <p className='text-sm text-red-500'>{errors.linkLojaIntegrada[0]}</p>
        )}
      </div>

      <SubmitButton isEditing={!!pecaParaEditar} />
    </form>
  );
}
