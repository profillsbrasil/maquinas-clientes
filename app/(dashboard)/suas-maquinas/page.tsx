'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

import CardMaquinaCliente from './_components/CardMaquinaCliente';
import MaquinasSkeletonGrid from './_components/MaquinasSkeletonGrid';
import { useSuasMaquinas } from './_hooks/useSuasMaquinas';

const ITEMS_POR_PAGINA = 8;

export default function SuasMaquinasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paginaAtual = Number(searchParams.get('page')) || 1;

  const { data, isLoading, error, prefetchNextPage, prefetchPreviousPage } =
    useSuasMaquinas(paginaAtual, ITEMS_POR_PAGINA);

  const maquinas = data?.maquinas || [];
  const totalPages = data?.totalPages || 0;
  const total = data?.total || 0;

  // Prefetch páginas adjacentes quando os dados carregarem
  useEffect(() => {
    if (!isLoading && data) {
      prefetchNextPage();
      prefetchPreviousPage();
    }
  }, [isLoading, data, prefetchNextPage, prefetchPreviousPage]);

  // Função para navegar entre páginas
  const navegarPagina = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(`/suas-maquinas?page=${page}`);
  };

  // Gerar array de páginas para mostrar na paginação
  const gerarPaginasVisiveis = () => {
    const paginas: (number | 'ellipsis')[] = [];
    const maxPaginas = 5;

    if (totalPages <= maxPaginas) {
      for (let i = 1; i <= totalPages; i++) {
        paginas.push(i);
      }
    } else {
      paginas.push(1);

      let inicio = Math.max(2, paginaAtual - 1);
      let fim = Math.min(totalPages - 1, paginaAtual + 1);

      if (paginaAtual <= 3) {
        fim = 4;
      }

      if (paginaAtual >= totalPages - 2) {
        inicio = totalPages - 3;
      }

      if (inicio > 2) {
        paginas.push('ellipsis');
      }

      for (let i = inicio; i <= fim; i++) {
        paginas.push(i);
      }

      if (fim < totalPages - 1) {
        paginas.push('ellipsis');
      }

      paginas.push(totalPages);
    }

    return paginas;
  };

  return (
    <main className='flex-1 relative h-full w-full bg-muted'>
      <div
        className={`px-5 pt-5 pb-5 mx-auto h-full w-full flex flex-col ${totalPages > 1 ? 'pb-20' : ''}`}>
        {/* Header */}
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Suas Máquinas</h1>
            <p className='text-muted-foreground'>
              {total > 0
                ? `${total} máquina${total !== 1 ? 's' : ''} disponível${total !== 1 ? 'is' : ''}`
                : 'Máquinas disponíveis para você'}
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && <MaquinasSkeletonGrid />}

        {/* Erro */}
        {error && (
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center space-y-4'>
              <div className='text-6xl'>⚠️</div>
              <h2 className='text-2xl font-bold'>Erro ao carregar máquinas</h2>
              <p className='text-muted-foreground'>
                {error instanceof Error ? error.message : 'Erro desconhecido'}
              </p>
            </div>
          </div>
        )}

        {/* Vazio */}
        {!isLoading && !error && total === 0 && (
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center space-y-4'>
              <div className='text-6xl'>🏭</div>
              <h2 className='text-2xl font-bold'>Nenhuma máquina disponível</h2>
              <p className='text-muted-foreground max-w-md'>
                Você ainda não possui máquinas associadas. Entre em contato com
                o suporte para mais informações.
              </p>
            </div>
          </div>
        )}

        {/* Grid de máquinas */}
        {!isLoading && !error && maquinas.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {maquinas.map((maquina) => (
              <CardMaquinaCliente
                key={maquina.id}
                id={maquina.id}
                nome={maquina.nome}
                imagem={maquina.imagem}
                totalPecas={maquina.totalPecas}
              />
            ))}
          </div>
        )}
      </div>

      {/* Paginação - só mostra se tiver mais de 1 página */}
      {totalPages > 1 && (
        <Pagination className='w-full fixed bottom-0 h-14 bg-slate-900 text-white z-10'>
          <div className='flex items-center justify-center w-1/3' />
          <PaginationContent>
            {/* Botão Anterior */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => navegarPagina(paginaAtual - 1)}
                onMouseEnter={prefetchPreviousPage}
                aria-disabled={paginaAtual <= 1}
                className={`
                  bg-slate-800 hover:bg-slate-700 hover:text-white text-white rounded-sm cursor-pointer
                  ${paginaAtual <= 1 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
            </PaginationItem>

            {/* Números das páginas */}
            {gerarPaginasVisiveis().map((pagina, index) => {
              if (pagina === 'ellipsis') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className='text-white' />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={pagina}>
                  <PaginationLink
                    onClick={() => navegarPagina(pagina)}
                    isActive={pagina === paginaAtual}
                    className={`
                      cursor-pointer rounded-sm border-none
                      ${
                        pagina === paginaAtual
                          ? 'bg-slate-600 text-white hover:bg-slate-700 hover:text-white'
                          : 'bg-slate-800 hover:bg-slate-700 hover:text-white text-white'
                      }
                    `}>
                    {pagina}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Botão Próximo */}
            <PaginationItem>
              <PaginationNext
                onClick={() => navegarPagina(paginaAtual + 1)}
                onMouseEnter={prefetchNextPage}
                aria-disabled={paginaAtual >= totalPages}
                className={`
                  bg-slate-800 hover:bg-slate-700 hover:text-white text-white rounded-sm cursor-pointer
                  ${paginaAtual >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
            </PaginationItem>
          </PaginationContent>
          <div className='flex items-center justify-center w-1/2' />
        </Pagination>
      )}
    </main>
  );
}
