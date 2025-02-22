import { diskStorage } from 'multer';
import { extname } from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

export const useStorage = (dest: string) =>
  diskStorage({
    destination: (_req, _file, cb) => {
      (async () => {
        await fs.mkdir(dest, { recursive: true });
        cb(null, dest);
      })().catch(console.error);
    },
    filename: (_req, file, cb) => {
      const extension = extname(file.originalname);
      cb(null, randomUUID() + extension);
    },
  });
