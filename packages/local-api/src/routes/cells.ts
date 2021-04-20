import express, { json } from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createcellsRouter = (
  filename: string,
  dir: string,
  isProduction: boolean
) => {
  const router = express.Router();
  router.use(express.json());
  let fullPath = path.join(dir, filename);

  if (!isProduction) {
    const basename = path.basename(fullPath);
    const dirname = path.dirname(fullPath);
    fullPath = path.join(dirname, '/cells-db', basename);
  }

  router.get('/cells', async (req, res) => {
    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      res.send(JSON.parse(result));
    } catch (error) {
      console.log(error);
      if (error.code === 'ENOENT') {
        await fs.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        console.log('Unhandled error', error);
      }
    }
  });

  router.post('/cells', async (req, res) => {
    // Take the list of cells from the request obj
    // serialize them
    const { cells }: { cells: Cell[] } = req.body;

    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};
