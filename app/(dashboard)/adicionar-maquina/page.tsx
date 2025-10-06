'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { criarMaquina, listarPecasDisponiveis } from './_actions/maquinas';
import AdicionarPeca from './_components/AdicionarPeca';
import FormularioMaquina from './_components/FormularioMaquina';
import ListaPecasMaquina from './_components/ListaPecasMaquina';
import { ChevronLeft, Save, Settings } from 'lucide-react';
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

  // Estado da máquina
  const [nomeMaquina, setNomeMaquina] = useState('');
  const [imagemMaquina, setImagemMaquina] = useState('');
  const [maquinaConfigurada, setMaquinaConfigurada] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);

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

  function handleConfigurarMaquina(nome: string, imagem: string) {
    setNomeMaquina(nome);
    setImagemMaquina(imagem);
    setMaquinaConfigurada(true);
    setMostrarFormulario(false);
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
    if (!nomeMaquina || !imagemMaquina) {
      toast.error('Configure a máquina primeiro');
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

      // Redirecionar para a lista de máquinas ou para edição
      setTimeout(() => {
        router.push('/suas-maquinas');
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

  // Se não configurou a máquina ainda, mostrar formulário
  if (!maquinaConfigurada || mostrarFormulario) {
    return (
      <div className='flex-1 h-full w-full flex flex-col items-center justify-center gap-4'>
        <FormularioMaquina
          nomeInicial={nomeMaquina}
          imagemInicial={imagemMaquina}
          onSalvar={handleConfigurarMaquina}
          onCancelar={
            maquinaConfigurada ? () => setMostrarFormulario(false) : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className='flex-1 h-full w-full'>
      <div className='mx-auto h-full w-full flex flex-col gap-4'>
        <div className='flex gap-4 w-full h-full justify-evenly'>
          {/* Área da imagem com grid */}
          <div className='relative w-1/2'>
            <Image
              src={imagemMaquina}
              alt={nomeMaquina}
              width={800}
              height={600}
              className='w-full h-full object-contain'
              priority
            />
            <div className='absolute top-0 left-0 w-full h-full grid grid-cols-30 hover:cursor-pointer'>
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
          <div className='flex flex-col gap-4 max-w-[30rem] pt-30 justify-start items-center'>
            <div className='flex flex-col gap-2 w-full justify-start items-start'>
              <h2 className='text-2xl font-bold'>Lista de Peças</h2>
              <p className='text-muted-foreground'>
                Peças adicionadas ({pecasAdicionadas.length})
              </p>
            </div>
            <ListaPecasMaquina
              pecas={pecasAdicionadas}
              onRemover={handleRemoverPeca}
            />
          </div>
        </div>

        {/* Rodapé com ações */}
        <div className='w-full relative h-16 bg-slate-900 flex items-center justify-between px-4'>
          <div className='flex items-center gap-4 h-full'>
            <Link href='/suas-maquinas'>
              <Button
                variant='outline'
                className='h-12 hover:bg-slate-700/90 hover:text-white flex items-center justify-center bg-slate-800 text-white border-border/20'>
                <ChevronLeft className='size-5 mr-2' />
                Voltar
              </Button>
            </Link>
            <h1 className='text-xl font-bold text-white'>
              Máquina: {nomeMaquina}
            </h1>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => setMostrarFormulario(true)}
              className='h-12 hover:bg-slate-700/90 hover:text-white flex items-center justify-center bg-slate-800 text-white border-border/20'>
              <Settings className='size-5 mr-2' />
              Configurar
            </Button>
            <Button
              onClick={handleSalvarMaquina}
              disabled={salvando || pecasAdicionadas.length === 0}
              className='h-12 bg-green-600 hover:bg-green-700 text-white'>
              <Save className='size-5 mr-2' />
              {salvando ? 'Salvando...' : 'Salvar Máquina'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
