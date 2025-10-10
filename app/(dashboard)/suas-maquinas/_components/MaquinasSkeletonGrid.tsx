export default function MaquinasSkeletonGrid() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className='flex relative bg-background flex-col items-center border shadow-md rounded-sm justify-center animate-pulse'>
          {/* Imagem skeleton */}
          <div className='flex h-75 px-4 py-2 w-full'>
            <div className='w-full h-full bg-muted rounded-sm' />
          </div>

          {/* Informações skeleton */}
          <div className='flex-1 h-25 border-t px-4 pb-4 pt-2 w-full space-y-2'>
            <div className='h-6 bg-muted rounded-sm w-3/4 mx-auto' />
            <div className='h-10 bg-muted rounded-sm w-full' />
          </div>
        </div>
      ))}
    </div>
  );
}
