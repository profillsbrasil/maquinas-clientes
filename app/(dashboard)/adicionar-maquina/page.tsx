'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { criarMaquina, listarPecasDisponiveis } from './_actions/maquinas';
import AdicionarPeca from './_components/AdicionarPeca';
import ListaPecasMaquina from './_components/ListaPecasMaquina';
import { ChevronLeft, ImageIcon, ImageUp, Save, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

type PecaType = {
  id: string;
  nome: string;
  linkLojaIntegrada: string;
  createdAt: Date;
  updatedAt: Date;
};

type PecaLocalType = {
  localizacao: number;
  pecaId: string;
  nome: string;
  linkLoja: string;
};

export default function AdicionarMaquinaPage() {
  const router = useRouter();

  // Estado da imagem (preview)
  const [imagemMaquina, setImagemMaquina] = useState('');
  const [imagemSelecionada, setImagemSelecionada] = useState(false);
  const [nomeArquivo, setNomeArquivo] = useState('');

  // Estado do nome (no rodapé)
  const [nomeMaquina, setNomeMaquina] = useState('');

  // Estado das peças
  const [pecasDisponiveis, setPecasDisponiveis] = useState<PecaType[]>([]);
  const [pecasAdicionadas, setPecasAdicionadas] = useState<PecaLocalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarPecasDisponiveis();
  }, []);

  async function carregarPecasDisponiveis() {
    setLoading(true);
    const pecasResult = await listarPecasDisponiveis();
    setPecasDisponiveis(pecasResult.data || []);
    setLoading(false);
  }

  function handleUploadImagem(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar se é imagem
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Verificar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 5MB');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagemMaquina(result);
      setImagemSelecionada(true);
      setNomeArquivo(file.name);
      toast.success('Imagem carregada!');
    };
    reader.readAsDataURL(file);
  }

  function handleRemoverImagem() {
    setImagemMaquina('');
    setImagemSelecionada(false);
    setNomeArquivo('');
    setPecasAdicionadas([]);
  }

  function handleAdicionarPeca(localizacao: number, pecaId: string) {
    const peca = pecasDisponiveis.find((p) => p.id === pecaId);
    if (!peca) return;

    // Verificar se já existe peça nessa localização
    const jaExiste = pecasAdicionadas.some(
      (p) => p.localizacao === localizacao
    );
    if (jaExiste) {
      toast.error('Já existe uma peça nesta localização');
      return;
    }

    const novaPeca: PecaLocalType = {
      localizacao,
      pecaId: peca.id,
      nome: peca.nome,
      linkLoja: peca.linkLojaIntegrada
    };

    setPecasAdicionadas([...pecasAdicionadas, novaPeca]);
    toast.success('Peça adicionada!');
  }

  function handleRemoverPeca(localizacao: number) {
    setPecasAdicionadas(
      pecasAdicionadas.filter((p) => p.localizacao !== localizacao)
    );
    toast.success('Peça removida!');
  }

  async function handleSalvarMaquina() {
    if (!nomeMaquina.trim()) {
      toast.error('Digite o nome da máquina');
      return;
    }

    if (!imagemMaquina) {
      toast.error('Selecione uma imagem para a máquina');
      return;
    }

    if (pecasAdicionadas.length === 0) {
      toast.error('Adicione pelo menos uma peça');
      return;
    }

    setSalvando(true);

    try {
      // Criar a máquina no banco
      const maquinaResult = await criarMaquina(nomeMaquina, imagemMaquina);

      if (!maquinaResult.success || !maquinaResult.data?.id) {
        toast.error(maquinaResult.message);
        setSalvando(false);
        return;
      }

      const maquinaId = maquinaResult.data.id;

      // Adicionar todas as peças usando a action
      const { adicionarPecaNaMaquina } = await import('./_actions/maquinas');

      for (const peca of pecasAdicionadas) {
        await adicionarPecaNaMaquina(maquinaId, peca.pecaId, peca.localizacao);
      }

      toast.success('Máquina salva com sucesso!');

      // Redirecionar para a lista de máquinas
      setTimeout(() => {
        router.push('/maquinas');
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar máquina');
    } finally {
      setSalvando(false);
    }
  }

  // Mapear peças por localização
  const pecasPorLocalizacao = new Map(
    pecasAdicionadas.map((p) => [p.localizacao, p])
  );

  if (loading) {
    return (
      <div className='flex-1 h-full w-full flex items-center justify-center'>
        <div className='text-white text-xl'>Carregando...</div>
      </div>
    );
  }

  // Se não fez upload da imagem ainda, mostrar tela de upload
  if (!imagemSelecionada) {
    return (
      <div className='flex-1 h-full w-full flex flex-col items-center justify-center gap-6 p-8'>
        <div className='flex flex-col items-center gap-4'>
          <h1 className='text-3xl font-bold '>Adicionar Nova Máquina</h1>
          <p className='text-muted-foreground text-center max-w-md'>
            Faça upload da imagem da máquina. Ela será usada como base para você
            adicionar as peças.
          </p>
        </div>

        <div className='flex flex-col gap-4 w-full max-w-md'>
          <Label
            htmlFor='upload-imagem'
            className='w-full h-32 border-2 border-dashed group border-slate-600 rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500  transition-colors'>
            <ImageIcon className='w-12 h-12 text-slate-400 group-hover:text-blue-500' />
            <span className=' font-medium'>Clique para fazer upload</span>
            <span className='text-xs text-muted-foreground'>
              PNG, JPG, WEBP (máx. 5MB)
            </span>
          </Label>
          <Input
            id='upload-imagem'
            type='file'
            accept='image/*'
            onChange={handleUploadImagem}
            className='hidden'
          />
        </div>

        <Link href='/maquinas'>
          <Button
            variant='outline'
            className='mt-3 w-48 rounded-sm flex  gap-2 items-center justify-center bg-slate-800 text-white hover:bg-slate-700 hover:text-white border-slate-600'>
            <ChevronLeft className='w-4 h-4 ' />
            Voltar
          </Button>
        </Link>
      </div>
    );
  }

  // Tela principal com imagem e grid
  return (
    <div className='flex-1 h-full w-full'>
      <div className='mx-auto h-[calc(100vh-64px)] w-full flex flex-col'>
        <div className='flex gap-4 w-full flex-1 justify-evenly overflow-hidden'>
          {/* Área da imagem com grid */}
          <div className='relative w-1/2 flex items-center justify-center p-4'>
            {/* Botão para trocar imagem */}
            <Button
              onClick={handleRemoverImagem}
              className='absolute h-10 w-40 top-4 right-4 bg-slate-800 rounded-none z-10  '>
              <ImageUp className='size-5 text-white' />
              <span className='text-white'>Trocar Imagem</span>
            </Button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagemMaquina}
              alt='Preview da máquina'
              className='w-full h-full object-contain'
            />
            <div className='absolute top-0 left-0 w-full h-full grid grid-cols-30 hover:cursor-pointer p-4'>
              {Array.from({ length: 600 }).map((_, index) => {
                const pecaExistente = pecasPorLocalizacao.get(index);
                return (
                  <AdicionarPeca
                    key={index}
                    localizacao={index}
                    pecasDisponiveis={pecasDisponiveis}
                    pecaExistente={
                      pecaExistente
                        ? {
                            pecaId: pecaExistente.pecaId,
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
          <div className='flex flex-col  w-[30rem] pt-30 justify-start items-center'>
            {/* Info da imagem */}
            <div className='w-full p-3 bg-slate-800 rounded-sm border border-slate-700'>
              <div className='flex items-center gap-2 text-sm'>
                <ImageIcon className='w-4 h-4 text-blue-400' />
                <span className='text-white font-medium truncate'>
                  {nomeArquivo} -
                </span>
                <span className='text-slate-300'>
                  {nomeArquivo.split('.')[1].toUpperCase()}
                </span>
              </div>
            </div>

            <div className='flex flex-col py-4 w-full justify-start items-start'>
              <h2 className='text-2xl font-bold '>Lista de Peças</h2>
              <p className='text-muted-foreground'>
                Clique nos quadrados para adicionar peças (
                {pecasAdicionadas.length})
              </p>
            </div>
            <ListaPecasMaquina
              pecas={pecasAdicionadas}
              onRemover={handleRemoverPeca}
            />
          </div>
        </div>

        {/* Rodapé com ações */}
        <div className='w-full h-14 bg-slate-900 flex items-center justify-between  '>
          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              className='h-14 border-r rounded-none hover:bg-slate-700/90 border-border/10  bg-slate-800 '
              onClick={() => router.push('/maquinas')}>
              <ChevronLeft className='size-5 text-white ' />
            </Button>

            <div className='flex items-center gap-3'>
              <label className='text-white font-medium whitespace-nowrap'>
                Nome da Máquina:
              </label>
              <Input
                type='text'
                value={nomeMaquina}
                onChange={(e) => setNomeMaquina(e.target.value)}
                placeholder='Ex: TP85'
                className='h-14 w-64 focus-visible:border-border/30 border-x bg-slate-800 border-border/10  text-white rounded-none placeholder:text-slate-400'
              />
            </div>
          </div>

          <Button
            onClick={handleSalvarMaquina}
            disabled={
              salvando || !nomeMaquina.trim() || pecasAdicionadas.length === 0
            }
            className='h-14 min-w-48 bg-green-600 border-none rounded-none hover:bg-green-700 text-white disabled:opacity-50'>
            <Save className='size-5 mr-1' />
            {salvando ? 'Salvando...' : 'Salvar Máquina'}
          </Button>
        </div>
      </div>
    </div>
  );
}
