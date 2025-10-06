import { listarPecas } from './_actions/pecas';
import DialogCriarPeca from './_components/DialogCriarPeca';
import ListaPecas from './_components/ListaPecas';

export default async function AdicionarPecaPage() {
  const result = await listarPecas();
  const pecas = result.data || [];

  return (
    <main className='flex-1 p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Gerenciar Peças
            </h1>
            <p className='text-muted-foreground mt-2'>
              Gerencie todas as peças cadastradas no sistema
            </p>
          </div>

          <DialogCriarPeca />
        </div>

        {/* Lista de Peças */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Todas as Peças</h2>
          <ListaPecas pecas={pecas} />
        </div>
      </div>
    </main>
  );
}
