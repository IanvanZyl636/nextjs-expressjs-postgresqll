import { prisma } from '../../integrations/prisma';
import { Readable } from 'stream';
import { processAndUploadImagesService } from './media.service';
import { readFileSync } from 'fs';

function createImageFile(buffer: Buffer, name = 'small.png'): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: name,
    encoding: '7bit',
    mimetype: 'image/png',
    size: buffer.length,
    buffer,
    destination: '',
    filename: '',
    path: '',
    stream: (() => {
      const s = new Readable();
      s.push(buffer);
      s.push(null);
      return s;
    })(),
  };
}

describe('media.service', () => {
  beforeAll(async () => {
    await prisma().$connect();
  });

  afterAll(async () => {
    await prisma().$disconnect();
  });

  test.only('processAndUploadImagesService uploads images and creates db records (e2e-like)', async () => {
    // load a real small png fixture
    const fixture = readFileSync(__dirname + '/__fixtures__/small.png');

    const file = createImageFile(fixture, 'small.png');

    const result = await processAndUploadImagesService(file);

    expect(result).toHaveProperty('id');
    expect(result.mediaType).toBeDefined();

  }, 20000);
});
