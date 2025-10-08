'use client';

import { useCallback, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import AdicionarPeca from './_components/AdicionarPeca';
import ListaPecasMaquina from './_components/ListaPecasMaquina';
import { useCriarMaquina } from './_hooks/useCriarMaquina';
import { usePecasAdicionadas } from './_hooks/usePecasAdicionadas';
import { usePecasDisponiveis } from './_hooks/usePecasDisponiveis';
import { useUploadImagem } from './_hooks/useUploadImagem';
import { ChevronLeft, ImageIcon, ImageUp, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdicionarMaquinaPage() {
  const router = useRouter();

  // Hooks customizados
  const { data: pecas = [], isLoading } = usePecasDisponiveis();
  const { imagem, uploading, handleUpload, removerImagem } = useUploadImagem();
  const { mutate: criarMaquina, isPending: salvando } = useCriarMaquina();
  const {
    pecasAdicionadas,
    pecasPorLocalizacao,
    handleAdicionarPeca,
    handleRemoverPeca,
    limparPecas
  } = usePecasAdicionadas(pecas);

  // Estado local
  const [nome, setNome] = useState('');

  // Handlers
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await handleUpload(file);
    },
    [handleUpload]
  );

  const handleRemoverImagemComPecas = useCallback(() => {
    removerImagem();
    limparPecas();
  }, [removerImagem, limparPecas]);

  const handleSalvar = useCallback(() => {
    if (!nome.trim()) {
      toast.error('Digite o nome da máquina');
      return;
    }

    if (!imagem) {
      toast.error('Selecione uma imagem');
      return;
    }

    if (pecasAdicionadas.length === 0) {
      toast.error('Adicione pelo menos uma peça');
      return;
    }

    criarMaquina({
      nome: nome.trim(),
      imagemUrl: imagem.url,
      pecas: pecasAdicionadas.map((p) => ({
        pecaId: p.pecaId,
        localizacao: p.localizacao
      }))
    });
  }, [nome, imagem, pecasAdicionadas, criarMaquina]);

  // Early returns - Loading
  if (isLoading) {
    return (
      <div className='flex-1 h-full w-full flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Spinner className='size-12 text-slate-800' />
          <div className='text-xl text-muted-foreground'>Carregando...</div>
        </div>
      </div>
    );
  }

  // Tela de upload
  if (!imagem) {
    return (
      <div className='flex-1 h-full w-full flex flex-col items-center justify-center gap-6 p-8'>
        <div className='flex flex-col items-center gap-4'>
          <h1 className='text-3xl font-bold'>Adicionar Nova Máquina</h1>
          <p className='text-muted-foreground text-center max-w-md'>
            Faça upload da imagem da máquina para começar
          </p>
        </div>

        <div className='flex flex-col gap-4 w-full max-w-md'>
          <Label
            htmlFor='upload-imagem'
            className='w-full h-32 border-2 border-dashed group border-slate-600 rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500 transition-colors'>
            <ImageIcon className='w-12 h-12 text-slate-400 group-hover:text-blue-500' />
            <span className='font-medium'>Clique para fazer upload</span>
            <span className='text-xs text-muted-foreground'>
              PNG, JPG, WEBP (máx. 10MB)
            </span>
          </Label>
          <Input
            id='upload-imagem'
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            disabled={uploading}
            className='hidden'
          />
        </div>

        <Link href='/maquinas'>
          <Button
            variant='outline'
            className='mt-3 w-48 rounded-sm flex gap-2 items-center justify-center bg-slate-800 text-white hover:bg-slate-700 hover:text-white border-slate-600'>
            <ChevronLeft className='w-4 h-4' />
            Voltar
          </Button>
        </Link>
      </div>
    );
  }

  // Tela principal
  return (
    <div className='flex-1 h-full w-full'>
      <div className='mx-auto h-[calc(100vh-64px)] w-full flex flex-col'>
        <div className='flex gap-4 w-full flex-1 justify-evenly overflow-hidden'>
          {/* Área da imagem */}
          <div className='relative w-1/2 flex items-center justify-center p-4'>
            <Button
              onClick={handleRemoverImagemComPecas}
              className='absolute h-10 w-40 top-4 right-4 bg-slate-800 rounded-none z-10'>
              <ImageUp className='size-5 text-white' />
              <span className='text-white'>Trocar Imagem</span>
            </Button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagem.url}
              alt='Preview da máquina'
              className='w-full h-full object-contain'
            />

            {/* Grid de localizações */}
            <div className='absolute top-0 left-0 w-full h-full grid grid-cols-30 hover:cursor-pointer p-4'>
              {Array.from({ length: 600 }).map((_, index) => {
                const pecaExistente = pecasPorLocalizacao.get(index);
                return (
                  <AdicionarPeca
                    key={index}
                    localizacao={index}
                    pecasDisponiveis={pecas}
                    pecaExistente={
                      pecaExistente
                        ? {
                            nome: pecaExistente.nome,
                            linkLoja: pecaExistente.linkLoja
                          }
                        : null
                    }
                    onAdicionar={handleAdicionarPeca}
                  />
                );
              })}
            </div>
          </div>

          {/* Lista de peças */}
          <div className='flex flex-col w-[30rem] pt-30 justify-start items-center'>
            <div className='w-full p-3 bg-slate-800 rounded-sm border border-slate-700'>
              <div className='flex items-center gap-2 text-sm'>
                <ImageIcon className='w-4 h-4 text-blue-400' />
                <span className='text-white font-medium truncate'>
                  {imagem.nome}
                </span>
              </div>
            </div>

            <div className='flex flex-col py-4 w-full justify-start items-start'>
              <h2 className='text-2xl font-bold'>Lista de Peças</h2>
              <p className='text-muted-foreground'>
                Clique nos quadrados para adicionar ({pecasAdicionadas.length})
              </p>
            </div>

            <ListaPecasMaquina
              pecas={pecasAdicionadas}
              onRemover={handleRemoverPeca}
            />
          </div>
        </div>

        {/* Rodapé */}
        <div className='w-full h-14 bg-slate-900 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              className='h-14 border-r rounded-none hover:bg-slate-700/90 border-border/10 bg-slate-800'
              onClick={() => router.push('/maquinas')}>
              <ChevronLeft className='size-5 text-white' />
            </Button>

            <div className='flex items-center gap-3'>
              <label className='text-white font-medium whitespace-nowrap'>
                Nome da Máquina:
              </label>
              <Input
                type='text'
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder='Ex: TP85'
                className='h-14 w-64 focus-visible:border-border/30 border-x bg-slate-800 border-border/10 text-white rounded-none placeholder:text-slate-400'
              />
            </div>
          </div>

          <Button
            onClick={handleSalvar}
            disabled={salvando || !nome.trim() || pecasAdicionadas.length === 0}
            className='h-14 min-w-48 bg-green-600 border-none rounded-none hover:bg-green-700 text-white disabled:opacity-50'>
            {salvando ? (
              <>
                <Spinner className='size-5 mr-2' />
                Salvando...
              </>
            ) : (
              <>
                <Save className='size-5 mr-1' />
                Salvar Máquina
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
