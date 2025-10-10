'use client';

import { useCallback, useState } from 'react';

import { toast } from 'sonner';

export type ImagemUpload = {
  url: string; // data URL (ou URL pública no futuro)
  nome: string;
  width?: number;
  height?: number;
  mime?: string;
  bytes?: number;
};

type UseUploadImagem = {
  imagem: ImagemUpload | null;
  uploading: boolean;
  error: string | null;
  handleUpload: (file: File) => Promise<void>;
  removerImagem: () => void;
};

export function useUploadImagem(): UseUploadImagem {
  const [imagem, setImagem] = useState<ImagemUpload | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removerImagem = useCallback(() => {
    setImagem(null);
    setError(null);
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    setError(null);

    // Validação: tipo
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida');
      setError('Arquivo não é imagem');
      return;
    }

    // Validação: tamanho
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Imagem muito grande (máx 10MB)');
      setError('Tamanho excedido');
      return;
    }

    // Feedback de progresso
    const loadingToast = toast.loading('Processando imagem...');
    setUploading(true);

    const startTime = performance.now();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro no upload');
      }

      setImagem({
        url: data.url,
        nome: file.name,
        width: data.width,
        height: data.height,
        mime: data.mime,
        bytes: data.bytes
      });

      const elapsed = Math.round(performance.now() - startTime);
      toast.success(`Imagem carregada em ${elapsed}ms!`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao fazer upload';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro no upload:', error);
    } finally {
      toast.dismiss(loadingToast);
      setUploading(false);
    }
  }, []);

  return { imagem, uploading, error, handleUpload, removerImagem };
}
