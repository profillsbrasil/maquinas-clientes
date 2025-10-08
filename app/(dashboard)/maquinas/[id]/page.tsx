import { notFound } from 'next/navigation';

import { buscarMaquinaPorId } from '../_actions/listar-maquinas';
import MaquinaVisualizar from './_components/MaquinaVisualizar';

interface MaquinaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MaquinaPage({ params }: MaquinaPageProps) {
  const { id } = await params;

  const resultado = await buscarMaquinaPorId(id);

  if (!resultado.success || !resultado.data) {
    notFound();
  }

  return (
    <main className='flex-1 h-full w-full'>
      <MaquinaVisualizar maquina={resultado.data} />
    </main>
  );
}
