'use client';

import { useState } from 'react';

import { toast } from 'sonner';

type ImagemUpload = {
  url: string;
  nome: string;
};

export function useUploadImagem() {
  const [imagem, setImagem] = useState<ImagemUpload | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Imagem muito grande (máx 10MB)');
      return;
    }

    const loadingToast = toast.loading('Fazendo upload...');
    setUploading(true);

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

      setImagem({ url: data.url, nome: file.name });
      toast.dismiss(loadingToast);
      toast.success('Imagem carregada!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : 'Erro no upload');
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
    }
  }

  function removerImagem() {
    setImagem(null);
  }

  return {
    imagem,
    uploading,
    handleUpload,
    removerImagem
  };
}
