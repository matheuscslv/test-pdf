import 'express-async-errors';
import 'dotenv/config';

import 'reflect-metadata';
import './repositories';

// @ts-ignore
import archiver from 'archiver';
import cors from 'cors';
import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import fs from 'fs';
import helmet from 'helmet';
import { get } from 'https';
import cron from 'node-cron';
import path from 'path';
import sharp from 'sharp';
import { getConnection } from 'typeorm';

// ROUTES
import createConnection from './database';
import callback from './routes/callback';
import detailsRoute from './routes/details';
import imagesRoute from './routes/images';
import institutionsRoute from './routes/institutions';
import loginRoute from './routes/login';
import optionsRoute from './routes/options';
import profilesRoute from './routes/profiles';
import relatoriesRoute from './routes/relatories';
import relfavoritesRoute from './routes/relfavorites';
import reportsRoute from './routes/report';
import searchRoute from './routes/search';
import solicitationsRoute from './routes/solicitations';
import usersRoute from './routes/users';

createConnection();

const app = express();
app.use(express.json());

// const apiKeys = [process.env.API_KEY];

app.use(
  cors({
    origin: '*',
  })
);

app.use(helmet());

cron.schedule(
  '0 1 * * *',
  () => {
    console.log(
      'Running a job for archives at 01:00 at America/Sao_Paulo timezone'
    );

    fs.readdir(path.join(__dirname, 'archives'), (err: any, files: any) => {
      if (err) {
        console.log(err);
      }

      const extensions = ['.zip'];

      files.forEach((file: any) => {
        const fileDir = path.join(path.join(__dirname, 'archives'), file);
        if (extensions.includes(path.extname(file).toLowerCase())) {
          fs.unlinkSync(fileDir);
        }
      });
    });

    fs.readdir(
      path.join(__dirname, 'tmp', 'uploads'),
      (err: any, files: any) => {
        if (err) {
          console.log(err);
        }

        const extensions = ['.pdf', '.zip'];

        files.forEach((file: any) => {
          const fileDir = path.join(
            path.join(__dirname, 'tmp', 'uploads'),
            file
          );
          if (extensions.includes(path.extname(file).toLowerCase())) {
            fs.unlinkSync(fileDir);
          }
        });
      }
    );
  },
  {
    scheduled: true,
    timezone: 'America/Sao_Paulo',
  }
);

// VALIDATION
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(err);
    next(err);
  }
);

/* if (process.env.NODE_ENV !== 'development') {
  app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    const key = req.query['api-key'] as string;

    // key isn't present
    if (!key) {
      res.status(404);
      res.send({ error: 'api key required' });
      return;
    }

    // key is invalid
    if (apiKeys.indexOf(key) === -1) {
      res.status(404);
      res.send({ error: 'invalid apid key' });
      return;
    }

    // all good, store req.key for route access
    req.key = key;
    next();
  });
} */

app.use('/v1/login', loginRoute);
app.use('/sso/callback', callback);
app.use('/v1/search', searchRoute);
app.use('/v1/search/options', optionsRoute);
app.use('/v1/details', detailsRoute);
app.use('/v1/images', imagesRoute);
app.use('/v1/institutions', institutionsRoute);
app.use('/v1/relatories', relatoriesRoute);
app.use('/v1/relatories/favorites', relfavoritesRoute);

app.use('/v1/users', usersRoute);
app.use('/v1/solicitations', solicitationsRoute);
app.use('/v1/profiles', profilesRoute);

app.use('/v1/reports', reportsRoute);

app.post('/query', async (req: Request, res: Response) => {
  try {
    const entityManager = getConnection().manager;
    const someQuery = await entityManager.query(req.body.query);
    return res.send(someQuery);
  } catch (error) {
    return res.send(error);
  }
});

app.use(
  '/tests',
  express.static(path.join(__dirname, 'tests', 'coverage', 'lcov-report'))
);

app.use('/files', express.static(path.join(__dirname, 'tmp', 'uploads')));

app.use('/download', express.static(path.join(__dirname, 'archives')));

function urlToBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const data: Uint8Array[] = [];
    get(url, (res) => {
      res
        .on('data', (chunk: Uint8Array) => {
          data.push(chunk);
        })
        .on('end', () => {
          resolve(Buffer.concat(data));
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  });
}

function maskCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return cpf;
}

// eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
archiver.registerFormat('zip-encrypted', require('archiver-zip-encrypted'));

app.post('/watermark', async (req: Request, res: Response) => {
  try {
    const imgs = req.body.imgs.map((item: any) => item.src);

    const buffers: any = [];

    await Promise.all(
      imgs.map(async (element: string) => {
        const imageBuffer = await urlToBuffer(element);

        const metadata = await sharp(imageBuffer).metadata();

        const svgImage = `
          <svg width="${metadata.width}" height="${400}">
            <style>
            .title { fill: #F00; font-size: 50px; font-weight: bold;}
            </style>
            <text x="50%" y="30%" text-anchor="middle" class="title">DOCUMENTO EMITIDO VIA SISID PARA O CPF: ${maskCPF(
              String(req.body.cpf).replace(/\D/g, '')
            )}</text>
          </svg>
        `;
        const svgBuffer = Buffer.from(svgImage);

        await sharp(imageBuffer)
          .composite([
            {
              input: svgBuffer,
              top: 50,
              left: 50,
            },
          ])
          .toFormat('png')
          .toBuffer()
          .then((data) => {
            buffers.push(data);
          })
          .catch((err) => {
            console.log(err);
            res.send({ error: err });
          });
      })
    );

    const filename = `${Date.now()}.zip`;
    const output = fs.createWriteStream(
      path.join(__dirname, 'archives', filename)
    );

    const archive = archiver.create('zip-encrypted', {
      zlib: { level: 9 },
      encryptionMethod: 'aes256',
      password: String(req.body.cpf).replace(/\D/g, ''),
    });

    /* const archive = archiver('zip', {
      zlib: { level: 9 },
    }); */
    archive.pipe(output);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < buffers.length; i++) {
      const buffer = Buffer.from(buffers[i]);
      archive.append(buffer, { name: `file${i + 1}.png` });
    }

    /* buffers.forEach((element: any, index: number) => {
      const buffer = Buffer.from(element);
      archive.append(buffer, { name: `file${index + 1}.png` });
    }); */

    await archive.finalize();

    const url = new URL(`https://${req.get('host')}${req.originalUrl}`);

    res.send({ url: `${url.origin}/download/${filename}` });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({ error: 'INRC: Tempo de exibição das imagens expirou' });
  }
});

// END
app.use((req: Request, res: Response) => {
  res.status(404);
  res.send({ error: 'Route not found' });
});

export default app;
