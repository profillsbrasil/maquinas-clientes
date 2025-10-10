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

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida');
      setError('Arquivo não é imagem');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande (máx 5MB)');
      setError('Tamanho excedido');
      return;
    }

    const loading = toast.loading('Fazendo upload...');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
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
      toast.success('Imagem carregada!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro no upload';
      setError(msg);
      toast.error(msg);
      console.error('Erro no upload:', e);
    } finally {
      toast.dismiss(loading);
      setUploading(false);
    }
  }, []);

  return { imagem, uploading, error, handleUpload, removerImagem };
}
