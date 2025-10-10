'use client';

import Image from 'next/image';

type ImagemMaquinaProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * Componente otimizado para renderizar imagens de máquinas
 * - Usa Next.js Image para URLs de Blob (otimização automática)
 * - Fallback para <img> nativo para data URLs (compatibilidade com sistema legado)
 */
export default function ImagemMaquina({
  src,
  alt,
  className = '',
  priority = false
}: ImagemMaquinaProps) {
  // Detectar se é data URL (base64) ou URL pública
  const isDataUrl = src.startsWith('data:');

  // Data URLs não podem usar Next.js Image
  if (isDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} loading='lazy' />
    );
  }

  // URLs públicas usam Next.js Image para otimização automática
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      className={className}
      style={{ objectFit: 'contain' }}
      priority={priority}
      quality={90}
      unoptimized={false}
    />
  );
}
