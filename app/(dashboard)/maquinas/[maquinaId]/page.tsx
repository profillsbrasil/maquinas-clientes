import { notFound } from 'next/navigation';

import MaquinasData from '../_components/MaquinasData';

interface MaquinaPageProps {
  params: {
    maquinaId: string;
  };
}

export default function MaquinaPage({ params }: MaquinaPageProps) {
  const maquina = MaquinasData.find(
    (maquina) => maquina.id === parseInt(params.maquinaId)
  );
  if (!maquina) {
    notFound();
  }
  return (
    <main className='flex-1 p-6 h-full w-full'>
      <div className='mx-auto  h-full w-full flex flex-col gap-4 '>
        <h1 className='text-3xl font-bold mb-4'>Máquina {params.maquinaId}</h1>
      </div>
    </main>
  );
}
