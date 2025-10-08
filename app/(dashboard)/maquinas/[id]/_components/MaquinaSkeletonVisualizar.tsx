import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

import { ChevronLeft, Headset } from 'lucide-react';

export default function MaquinaSkeletonVisualizar() {
  return (
    <div className='mx-auto h-[calc(100vh-64px)] w-full flex flex-col'>
      <div className='flex gap-4 w-full flex-1 justify-evenly overflow-hidden'>
        {/* Skeleton da imagem */}
        <div className='relative w-1/2 h-full flex items-center justify-center p-4'>
          <Skeleton className='w-full h-1/2 bg-muted flex items-center justify-center gap-2'>
            <Spinner className='size-4' /> Carregando...
          </Skeleton>
        </div>

        {/* Skeleton da lista de peças */}
        <div className='flex flex-col w-[30rem] pt-30 justify-start items-start'>
          <div className='flex flex-col py-4 w-full justify-start items-start'>
            <Skeleton className='h-8 w-48 mb-2' />
            <Skeleton className='h-4 w-64' />
          </div>
          <div className='max-h-100 max-w-[30rem] min-w-[20rem] p-4 bg-muted rounded-sm'>
            <div className='flex flex-col gap-2 w-full'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-10 w-full bg-muted' />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='w-full relative h-14 bg-slate-900 flex items-center justify-between'>
        <div className='flex w-1/2 min-w-[20rem] items-center justify-center h-full gap-10'>
          <Link
            href='/maquinas'
            className='h-full flex items-center justify-center'>
            <Button
              variant='outline'
              className='w-full rounded-none h-full !border-x hover:bg-slate-700/90 hover:text-white flex items-center justify-center bg-slate-800 text-white border-border/10'>
              <ChevronLeft className='size-6' />
            </Button>
          </Link>
          <Skeleton className='h-6 w-48 bg-slate-700' />
        </div>
        <div className='flex w-1/2 h-full justify-end items-center'>
          <Button
            variant='outline'
            disabled
            className='h-14 min-w-48 rounded-none hover:bg-slate-700/90 hover:text-white border-x bg-slate-800 text-white border-border/10'>
            <Headset className='w-4 h-4 mr-2' /> Solicitar Auxílio
          </Button>
        </div>
      </div>
    </div>
  );
}
