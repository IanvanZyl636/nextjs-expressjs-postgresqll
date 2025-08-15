import sharp from 'sharp';

export async function getImageExtension(meta: sharp.Metadata): Promise<string | null> { 
    if (!meta.format) throw new Error('Missing image format');

    const formatMap: Record<string, string> = {
      jpeg: 'jpg',
      tiff: 'tif'
    };

    return formatMap[meta.format] || meta.format;
}