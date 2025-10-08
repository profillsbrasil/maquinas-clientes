// Utility para debounce (evita múltiplas chamadas rápidas)
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Exemplo de uso:
// const debouncedSearch = debounce((term) => search(term), 300);
// debouncedSearch('texto'); // Só executa após 300ms de inatividade
