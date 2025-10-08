import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <main className='flex-1 h-full w-full flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <Spinner className='size-12 text-slate-800' />
        <p className='text-xl text-muted-foreground'>Carregando máquina...</p>
      </div>
    </main>
  );
}
