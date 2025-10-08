'use client';

import { ReactNode, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache por 5 minutos
            staleTime: 1000 * 60 * 5,
            // Manter em cache por 10 minutos
            gcTime: 1000 * 60 * 10,
            // Revalidar ao focar na janela
            refetchOnWindowFocus: true,
            // Revalidar ao reconectar
            refetchOnReconnect: true,
            // Retry automático
            retry: 1
          },
          mutations: {
            // Renderização otimista por padrão
            retry: 1
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools - só em dev */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
    </QueryClientProvider>
  );
}
