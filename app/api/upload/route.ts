import { NextRequest, NextResponse } from 'next/server';

import { put } from '@vercel/blob';

import sharp from 'sharp';

// Garante Node runtime (necessário para sharp e Buffer)
export const runtime = 'nodejs';
// Força execução dinâmica (sem cache)
export const dynamic = 'force-dynamic';

// Configurações
const MAX_BYTES = 10 * 1024 * 1024; // 10MB de entrada
const MAX_DIMENSION = 2048; // Limita lado maior da imagem
const WEBP_QUALITY = 85; // Qualidade do WebP (0-100)
const WEBP_EFFORT = 3; // Esforço de compressão (0-6, menor = mais rápido)

type UploadResult = {
  success: boolean;
  url?: string;
  mime?: string;
  bytes?: number;
  width?: number;
  height?: number;
  message?: string;
  error?: string;
};

// Gera nome único e seguro para o arquivo
function generateSecureFilename(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `maquina-${timestamp}-${random}.webp`;
}

// Processa e otimiza a imagem (OTIMIZADO PARA VELOCIDADE)
async function processImage(buffer: Buffer): Promise<{
  data: Buffer;
  width: number;
  height: number;
}> {
  // Pipeline otimizado: todas operações em uma única passada
  const result = await sharp(buffer, {
    failOnError: true,
    unlimited: false, // Previne imagens muito grandes
    sequentialRead: true // Otimiza leitura sequencial
  })
    .rotate() // Auto-rotate baseado em EXIF
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
      kernel: 'lanczos3' // Algoritmo rápido e com boa qualidade
    })
    .webp({
      quality: WEBP_QUALITY,
      effort: WEBP_EFFORT, // 3 = balanço perfeito velocidade/qualidade
      nearLossless: false, // Desabilita processamento extra
      smartSubsample: true, // Subsampling inteligente (mais rápido)
      preset: 'photo' // Preset otimizado para fotos
    })
    .toBuffer({ resolveWithObject: true });

  return {
    data: result.data,
    width: result.info.width,
    height: result.info.height
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse do FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validação: arquivo existe
    if (!file) {
      return NextResponse.json<UploadResult>(
        { success: false, error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    // Validação: tamanho
    if (file.size > MAX_BYTES) {
      return NextResponse.json<UploadResult>(
        { success: false, error: 'Imagem muito grande (máximo 10MB)' },
        { status: 400 }
      );
    }

    // Validação: tipo MIME
    if (!file.type.startsWith('image/')) {
      return NextResponse.json<UploadResult>(
        { success: false, error: 'Arquivo não é uma imagem' },
        { status: 400 }
      );
    }

    // Converter para Buffer (Sharp já valida a imagem internamente)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Processar e otimizar imagem (Sharp falhará se não for imagem válida)
    const { data: processedBuffer, width, height } = await processImage(buffer);

    // Gerar nome único
    const filename = generateSecureFilename();

    // Upload para Vercel Blob
    const blob = await put(filename, processedBuffer, {
      access: 'public',
      contentType: 'image/webp',
      addRandomSuffix: false // Já incluímos random no nome
    });

    // Retornar sucesso com URL pública
    return NextResponse.json<UploadResult>(
      {
        success: true,
        url: blob.url,
        mime: 'image/webp',
        bytes: processedBuffer.length,
        width,
        height,
        message: 'Upload realizado com sucesso'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro no upload:', error);

    // Error handling específico
    if (error instanceof Error) {
      // Erro do Sharp (imagem inválida/corrompida)
      if (error.message.includes('Input buffer')) {
        return NextResponse.json<UploadResult>(
          { success: false, error: 'Imagem corrompida ou formato inválido' },
          { status: 400 }
        );
      }

      // Erro de memória
      if (error.message.includes('memory')) {
        return NextResponse.json<UploadResult>(
          { success: false, error: 'Imagem muito complexa para processar' },
          { status: 400 }
        );
      }
    }

    // Erro genérico
    return NextResponse.json<UploadResult>(
      { success: false, error: 'Erro ao processar upload' },
      { status: 500 }
    );
  }
}
