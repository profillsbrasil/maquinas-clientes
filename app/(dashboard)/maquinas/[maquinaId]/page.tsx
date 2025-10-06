import { notFound } from 'next/navigation';

import MaquinasData from './_components/MaquinasData';
import Envolvedora from './_components/maquinas/Envolvedora';
import Teste from './_components/maquinas/Teste';
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

  // Renderiza o componente específico com base no ID da máquina
  const renderMaquinaComponent = () => {
    switch (maquinaId) {
      case '1':
        return <Tp maquina={maquina} />;
      case '2':
        return <Envolvedora maquina={maquina} />;
      case '3':
        return <Teste maquina={maquina} />;
      default:
        notFound();
    }
  };

  return (
    <main className='flex-1 h-full w-full'>{renderMaquinaComponent()}</main>
  );
}
