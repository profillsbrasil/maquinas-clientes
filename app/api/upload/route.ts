import { NextRequest, NextResponse } from 'next/server';

import sharp from 'sharp';

// Garante Node, não Edge (evita limites mais baixos e permite Buffer/sharp)
export const runtime = 'nodejs';
// Evita cache estático de build
export const dynamic = 'force-dynamic';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB de entrada
const MAX_DIMENSION = 2048; // limita lado maior

// Valida assinatura básica via magic numbers (bem simples; para mais tipos, use 'file-type' lib)
function looksLikeImage(buf: Buffer): boolean {
  if (buf.length < 4) return false;
  const jpg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const png =
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const webp =
    buf.slice(0, 4).toString('ascii') === 'RIFF' &&
    buf.slice(8, 12).toString('ascii') === 'WEBP';
  return jpg || png || webp;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Arquivo não enviado' },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Imagem muito grande (máx 5MB)' },
        { status: 400 }
      );
    }

    // Lê em memória (você pode streamar/multiparte se mudar pra S3/Blob)
    const buf = Buffer.from(await file.arrayBuffer());

    if (!looksLikeImage(buf)) {
      return NextResponse.json(
        { success: false, error: 'Arquivo não é uma imagem válida' },
        { status: 400 }
      );
    }

    // Reprocessa: remove metadata, limita dimensão e converte para WebP
    const image = sharp(buf, { failOnError: true }).rotate(); // auto orient
    const meta = await image.metadata();

    const width = meta.width ?? undefined;
    const height = meta.height ?? undefined;

    const needResize =
      (width && width > MAX_DIMENSION) || (height && height > MAX_DIMENSION);

    const pipeline = needResize
      ? image.resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: 'inside',
          withoutEnlargement: true
        })
      : image;

    const webp = await pipeline
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });

    const outBuf = webp.data;
    const outMeta = await sharp(outBuf).metadata();

    // Gera Data URL (mantendo seu fluxo atual)
    const base64 = outBuf.toString('base64');
    const dataUrl = `data:image/webp;base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      mime: 'image/webp',
      bytes: outBuf.length,
      width: outMeta.width,
      height: outMeta.height,
      message: 'Upload realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer upload' },
      { status: 500 }
    );
  }
}
