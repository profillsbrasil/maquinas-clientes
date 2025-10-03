import { notFound } from 'next/navigation';

import MaquinasData from '../_components/MaquinasData';
import Tp from './_components/maquinas/Tp';

interface MaquinaPageProps {
  params: Promise<{
    maquinaId: string;
  }>;
}

export default async function MaquinaPage({ params }: MaquinaPageProps) {
  const { maquinaId } = await params;

  const maquina = MaquinasData.find(
    (maquina) => maquina.id === parseInt(maquinaId)
  );
  if (!maquina) {
    notFound();
  }
  return (
    <main className='flex-1 p-6 h-full w-full'>
      <Tp maquinaId={maquinaId} />
    </main>
  );
}
