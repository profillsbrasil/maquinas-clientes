'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { imagensMaquinas } from '@/lib/imagens-maquinas';

import { Check, X } from 'lucide-react';

type FormularioMaquinaProps = {
  nomeInicial?: string;
  imagemInicial?: string;
  onSalvar: (nome: string, imagem: string) => void;
  onCancelar?: () => void;
};

export default function FormularioMaquina({
  nomeInicial = '',
  imagemInicial = '',
  onSalvar,
  onCancelar
}: FormularioMaquinaProps) {
  const [nome, setNome] = useState(nomeInicial);
  const [imagemSelecionada, setImagemSelecionada] = useState(imagemInicial);

  function handleSalvar() {
    if (!nome.trim()) {
      alert('Digite o nome da máquina');
      return;
    }

    if (!imagemSelecionada) {
      alert('Selecione uma imagem');
      return;
    }

    onSalvar(nome, imagemSelecionada);
  }

  return (
    <div className='flex flex-col gap-4 w-full max-w-md p-6 bg-slate-800 rounded-lg'>
      <h2 className='text-xl font-bold text-white'>Configurar Máquina</h2>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='nome' className='text-white'>
          Nome da Máquina
        </Label>
        <Input
          id='nome'
          type='text'
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder='Ex: TP85'
          className='bg-slate-700 text-white border-slate-600'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='imagem' className='text-white'>
          Selecione a Imagem da Máquina
        </Label>
        <Select value={imagemSelecionada} onValueChange={setImagemSelecionada}>
          <SelectTrigger className='bg-slate-700 text-white border-slate-600'>
            <SelectValue placeholder='Escolha uma máquina' />
          </SelectTrigger>
          <SelectContent>
            {imagensMaquinas.map((img) => (
              <SelectItem key={img.id} value={img.url}>
                {img.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex gap-2'>
        <Button
          onClick={handleSalvar}
          className='flex-1 bg-green-600 hover:bg-green-700 text-white'>
          <Check className='w-4 h-4 mr-2' />
          Confirmar
        </Button>
        {onCancelar && (
          <Button
            onClick={onCancelar}
            variant='outline'
            className='flex-1 bg-slate-700 hover:bg-slate-600 text-white border-slate-600'>
            <X className='w-4 h-4 mr-2' />
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}
