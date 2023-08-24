import { encrypt } from '@manojadams/node-qpdf2';
// @ts-ignore
import archiver from 'archiver';
// @ts-ignore
import carbone from 'carbone';
import { stringify } from 'csv-stringify';
import { Request, Response } from 'express';
import fs from 'fs';
import handlebars from 'handlebars';
import { sign } from 'jsonwebtoken';
import moment from 'moment';
import path from 'path';
import puppeteer from 'puppeteer';
// @ts-ignore
import QRCode from 'qrcode';
import { container } from 'tsyringe';

import AppError from '../utils/error';
import { DetailsService } from './services/DetailsService';
import { SearchService } from './services/SearchService';
import { UserService } from './services/UserService';

export async function individual(req: Request, res: Response) {
  try {
    const userService = container.resolve(UserService);

    const user = await userService.userlogged(req.userId);

    const detailsService = container.resolve(DetailsService);

    let result: any = null;
    try {
      result = await detailsService.execute(req.body.user.rg);
    } catch (error) {
      throw new AppError('Informação não encontrada!', 404);
    }

    const fileTemplate = path.resolve(
      __dirname,
      '..',
      'resources',
      'views',
      'reports',
      'report.hbs'
    );

    const templateFileContent = await fs.promises.readFile(fileTemplate, {
      encoding: 'utf-8',
    });

    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--enable-font-antialiasing',
        '--font-render-hinting=none',
        '--disable-web-security',
        '--disable-gpu',
        '--hide-scrollbars',
        '--disable-setuid-sandbox',
        '--force-color-profile=srgb',
      ],
    });

    const pagina = await browser.newPage();
    await pagina.setViewport({ width: 1080, height: 1024 });

    await pagina.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
    );

    const parseTemplate = handlebars.compile(templateFileContent);

    handlebars.registerHelper('ifYes', function (value, options) {
      // @ts-ignore
      return value === true ? options.fn(this) : options.inverse(this);
    });

    handlebars.registerHelper('ifNullable', function (value, options) {
      return value === 'Não disponível'
        ? // @ts-ignore
          options.fn(this)
        : // @ts-ignore
          options.inverse(this);
    });

    const photo = fs
      .readFileSync(
        `${path.join(
          __dirname,
          '..',
          'resources',
          'views',
          'reports',
          'photo.png'
        )}`
      )
      .toString('base64');

    const dataContext = {
      base_url: process.env.BASE_URL,
      options: req.body,
      result: {
        ...result,
        nome_mae: result.nome_mae || 'Não disponível',
        endereco: result.endereco || 'Não disponível',
        cpf: result.cpf || 'Não disponível',

        idUF: result.idUF || 'Não disponível',
        rgUF: result.rgUF || 'Não disponível',
        nomeSocial: result.nomeSocial || 'Não disponível',
        sexo: result.sexo || 'Não disponível',
        pais: result.pais || 'Não disponível',
        dadosCertidao: result.dadosCertidao || 'Não disponível',
        tipoCertidao: result.tipoCertidao || 'Não disponível',
        cnh: result.cnh || 'Não disponível',
        cns: result.cns || 'Não disponível',
        TituloEleitor: result.TituloEleitor || 'Não disponível',
        pispasep: result.pispasep || 'Não disponível',
        certidaoMilitar: result.certidaoMilitar || 'Não disponível',
        ctps: result.ctps || 'Não disponível',
        cip: result.cip || 'Não disponível',

        indSaudeFisica:
          result.indSaudeFisica === 'false'
            ? 'Não disponível'
            : result.indSaudeFisica,
        indSaudeIntelectual:
          result.indSaudeIntelectual === 'false'
            ? 'Não disponível'
            : result.indSaudeIntelectual,
        indSaudeVisual:
          result.indSaudeVisual === 'false'
            ? 'Não disponível'
            : result.indSaudeVisual,
        indSaudeAuditiva:
          result.indSaudeAuditiva === 'false'
            ? 'Não disponível'
            : result.indSaudeAuditiva,
        indSaudeAutismo:
          result.indSaudeAutismo === 'false'
            ? 'Não disponível'
            : result.indSaudeAutismo,

        indTipoSanguineo: result.indTipoSanguineo || 'Não disponível',
        indSaudeObservacao: result.indSaudeObservacao || 'Não disponível',
        dataEmissao: result.dataEmissao
          ? moment(result.dataEmissao).format('DD/MM/YYYY')
          : 'Não disponível',
        cedulaEmissao: result.cedulaEmissao || 'Não disponível',
        viaEmissao: result.viaEmissao || 'Não disponível',
        nome_pai: result.nome_pai || 'Não disponível',
        data_nascimento: result.data_nascimento
          ? moment(result.data_nascimento).format('DD/MM/YYYY')
          : 'Não disponível',
        uf_naturalidade: result.uf_naturalidade || 'Não disponível',
        descr_naturalidade: result.descr_naturalidade || 'Não disponível',
        cod_nacionalidade: result.cod_nacionalidade || 'Não disponível',
        cod_naturalidade_ibge: result.cod_naturalidade_ibge || 'Não disponível',
        cadastro_biometrico:
          result.cadastro_biometrico === 'false'
            ? 'Não disponível'
            : result.cadastro_biometrico,
      },
      photo,
    };

    const html = parseTemplate(dataContext);

    const filename = `${result.nome}_${new Date().getDate()}.${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}.${new Date().getFullYear()}.pdf`;

    const tmpFolder = path.resolve(__dirname, '..', 'tmp');

    const reportsFolder = path.resolve(tmpFolder, 'uploads');

    const pathFile = `${reportsFolder}/${filename}`;

    await pagina.setContent(html);

    const QRbase64 = await new Promise((resolve, reject) => {
      // @ts-ignore
      QRCode.toDataURL(
        sign(
          {
            cpf: String(user?.cpf).replace(
              /(\d{3})(\d{3})(\d{3})(\d{2})/g,
              '$1.$2.$3-$4'
            ),
            nome: user?.nome,
            instituicao: user?.instituicao?.sigla || 'GERAL',
          },
          process.env.API_KEY || '',
          {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
          }
        ),
        function (err: any, code: any) {
          if (err) {
            reject(reject);
            return;
          }
          resolve(code);
        }
      );
    });

    await pagina.pdf({
      path: pathFile,
      // landscape: true,
      printBackground: true,
      format: 'a4',
      displayHeaderFooter: true,
      headerTemplate:
        '<div id="header-template" style="font-size:10px !important; color:#808080; padding-left:10px"></div>',
      footerTemplate: `
      <div style="margin-left: 20px; margin-right: 20px; width: 100vh;">
        <div style="border-top: 1px solid #000; margin-bottom: 10px;"></div>

        <div id="footer-template" style="display: flex; flex-direction: row; justify-content: space-between;">
          <div style="display: flex; flex-direction: row; align-items: center; ">
            <img style="width: 70px; height: 70px;" src="${QRbase64}" />

            <div style="margin-left: 5px;">
              <h1 style="font-size: 12px; font-weight: normal; font-family: Roboto;">Gerado no SISID por: ${
                user?.nome
              }</h1>
              <h1 style="font-size: 12px; font-weight: normal; font-family: Roboto;">Orgão: ${
                user?.instituicao?.sigla || ''
              }</h1>
              <h1 style="font-size: 12px; font-weight: normal; font-family: Roboto;">Em: ${moment().format(
                'DD/MM/YYYY'
              )}</h1>
            </div>
          </div>

          <div style="margin-left: 190px;">
            <h1 style="font-size: 12px; font-weight: normal; font-family: Roboto;">Página: <span class="pageNumber"></span> de <span class="totalPages"></span></h1>
          </div>
        </div>
      </div>
      `,
      margin: { top: 50, bottom: 150, left: 20, right: 20 },
    });
    await browser.close();

    const pdf = {
      input: pathFile,
      output: pathFile,
      password: user?.cpf.substring(0, 5),
    };

    await encrypt(pdf);

    const url = `${process.env.BASE_URL}/files/${filename}`;

    return res.send({ url });
  } catch (error) {
    return res.send(error);
  }
}

export async function general(req: Request, res: Response) {
  try {
    const userService = container.resolve(UserService);

    const user = await userService.userlogged(req.userId);

    const searchService = container.resolve(SearchService);

    const result = await searchService.execute(
      req.body.texto,
      req.body.dt_ocorrencia,
      req.body.dt_nascimento,
      req.body.quantidade_por_pagina,
      req.body.pagina_atual
    );

    if (req.body.format === 'csv') {
      const data = [];
      const columns = {
        documentos: 'Documentos',
        nome: 'Nome',
        nome_da_mae: 'Nome da mãe',
        endereco: 'Endereço',
        nascimento: 'Nascimento',
      };

      const aux = result.map((item) => ({
        ...item,
        cpf: item?.cpf
          ? String(item.cpf).replace(
              /(\d{3})(\d{3})(\d{3})(\d{2})/g,
              '$1.$2.$3-$4'
            )
          : item?.cpf,
        nome_mae: item?.nome_mae || '',
        endereco:
          item?.descr_naturalidade && item?.uf_naturalidade && item?.pais
            ? `${item.descr_naturalidade} - ${item.uf_naturalidade}, ${item.pais}`
            : '',
        data_nascimento: item?.data_nascimento
          ? `${item.data_nascimento.split('-')[2]}/${
              item.data_nascimento.split('-')[1]
            }/${item.data_nascimento.split('-')[0]}`
          : '',
      }));

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < aux.length; i++) {
        data.push([
          `${aux[i].rg} ${aux[i].cpf}`,
          aux[i].nome,
          aux[i].nome_mae,
          aux[i].endereco,
          aux[i].data_nascimento,
        ]);
      }

      const filename = `${
        user?.instituicao?.sigla
          ? String(user?.instituicao?.sigla).toUpperCase()
          : 'GERAL'
      }_${new Date().getDate()}.${String(new Date().getMonth() + 1).padStart(
        2,
        '0'
      )}.${new Date().getFullYear()}.csv`;

      const tmpFolder = path.resolve(__dirname, '..', 'tmp');

      const reportsFolder = path.resolve(tmpFolder, 'uploads');

      const pathFile = `${reportsFolder}/${filename}`;

      stringify(data, { header: true, columns }, (err, output) => {
        if (err) throw err;
        fs.writeFile(pathFile, output, async (err) => {
          if (err) throw err;

          const name = `${
            user?.instituicao?.sigla
              ? String(user?.instituicao?.sigla).toUpperCase()
              : 'GERAL'
          }_${new Date().getDate()}.${String(
            new Date().getMonth() + 1
          ).padStart(2, '0')}.${new Date().getFullYear()}.zip`;

          const tmpFolder = path.resolve(__dirname, '..', 'tmp');
          const reportsFolder = path.resolve(tmpFolder, 'uploads');

          const output = fs.createWriteStream(path.join(reportsFolder, name));

          const archive = archiver.create('zip-encrypted', {
            zlib: { level: 9 },
            encryptionMethod: 'aes256',
            password: user?.cpf.substring(0, 5),
          });

          archive.pipe(output);
          archive.append(fs.createReadStream(pathFile), { name: filename });
          await archive.finalize();

          const url = `${process.env.BASE_URL}/files/${name}`;

          return res.send({ url });
        });
      });
    } else if (req.body.format === 'ods') {
      const aux = result.map((item) => ({
        ...item,
        cpf: item?.cpf
          ? String(item.cpf).replace(
              /(\d{3})(\d{3})(\d{3})(\d{2})/g,
              '$1.$2.$3-$4'
            )
          : item?.cpf,
        nome_mae: item?.nome_mae || '',
        endereco:
          item?.descr_naturalidade && item?.uf_naturalidade && item?.pais
            ? `${item.descr_naturalidade} - ${item.uf_naturalidade}, ${item.pais}`
            : '',
        data_nascimento: item?.data_nascimento
          ? `${item.data_nascimento.split('-')[2]}/${
              item.data_nascimento.split('-')[1]
            }/${item.data_nascimento.split('-')[0]}`
          : '',
      }));

      const filename = `${
        user?.instituicao?.sigla
          ? String(user?.instituicao?.sigla).toUpperCase()
          : 'GERAL'
      }_${new Date().getDate()}.${String(new Date().getMonth() + 1).padStart(
        2,
        '0'
      )}.${new Date().getFullYear()}.ods`;

      const tmpFolder = path.resolve(__dirname, '..', 'tmp');

      const reportsFolder = path.resolve(tmpFolder, 'uploads');

      const pathFile = `${reportsFolder}/${filename}`;

      try {
        carbone.render(
          path.resolve(
            __dirname,
            '..',
            'resources',
            'views',
            'reports',
            'flat_table_original.ods'
          ),
          aux,
          async function (err: any, result: any) {
            if (err) {
              console.log(err);
            }

            fs.writeFileSync(pathFile, result);

            const name = `${
              user?.instituicao?.sigla
                ? String(user?.instituicao?.sigla).toUpperCase()
                : 'GERAL'
            }_${new Date().getDate()}.${String(
              new Date().getMonth() + 1
            ).padStart(2, '0')}.${new Date().getFullYear()}.zip`;

            const tmpFolder = path.resolve(__dirname, '..', 'tmp');
            const reportsFolder = path.resolve(tmpFolder, 'uploads');

            const output = fs.createWriteStream(path.join(reportsFolder, name));

            const archive = archiver.create('zip-encrypted', {
              zlib: { level: 9 },
              encryptionMethod: 'aes256',
              password: user?.cpf.substring(0, 5),
            });

            archive.pipe(output);
            archive.append(fs.createReadStream(pathFile), { name: filename });
            await archive.finalize();

            const url = `${process.env.BASE_URL}/files/${name}`;

            return res.send({ url });
          }
        );
      } catch (error) {
        return res.send(error);
      }
    }

    const fileTemplate = path.resolve(
      __dirname,
      '..',
      'resources',
      'views',
      'reports',
      'report_general.hbs'
    );

    const templateFileContent = await fs.promises.readFile(fileTemplate, {
      encoding: 'utf-8',
    });

    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--enable-font-antialiasing',
        '--font-render-hinting=none',
        '--disable-web-security',
        '--disable-gpu',
        '--hide-scrollbars',
        '--disable-setuid-sandbox',
        '--force-color-profile=srgb',
      ],
    });

    const pagina = await browser.newPage();
    await pagina.setViewport({ width: 1080, height: 1024 });

    await pagina.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
    );

    const parseTemplate = handlebars.compile(templateFileContent);

    const photo = fs
      .readFileSync(
        `${path.join(
          __dirname,
          '..',
          'resources',
          'views',
          'reports',
          'photo.png'
        )}`
      )
      .toString('base64');

    const dataContext = {
      base_url: process.env.BASE_URL,
      result: result.map((item) => ({
        ...item,
        cpf: item?.cpf
          ? String(item.cpf).replace(
              /(\d{3})(\d{3})(\d{3})(\d{2})/g,
              '$1.$2.$3-$4'
            )
          : item?.cpf,
        nome_mae: item?.nome_mae || '',
        endereco:
          item?.descr_naturalidade && item?.uf_naturalidade && item?.pais
            ? `${item.descr_naturalidade} - ${item.uf_naturalidade}, ${item.pais}`
            : '',
        data_nascimento: item?.data_nascimento
          ? `${item.data_nascimento.split('-')[2]}/${
              item.data_nascimento.split('-')[1]
            }/${item.data_nascimento.split('-')[0]}`
          : '',
      })),
      photo,
    };

    const html = parseTemplate(dataContext);

    const filename = `${
      user?.instituicao?.sigla
        ? String(user?.instituicao?.sigla).toUpperCase()
        : 'GERAL'
    }_${new Date().getDate()}.${String(new Date().getMonth() + 1).padStart(
      2,
      '0'
    )}.${new Date().getFullYear()}.pdf`;

    const tmpFolder = path.resolve(__dirname, '..', 'tmp');

    const reportsFolder = path.resolve(tmpFolder, 'uploads');

    const pathFile = `${reportsFolder}/${filename}`;

    await pagina.setContent(html);

    const QRbase64 = await new Promise((resolve, reject) => {
      QRCode.toDataURL(
        sign(
          {
            cpf: String(user?.cpf).replace(
              /(\d{3})(\d{3})(\d{3})(\d{2})/g,
              '$1.$2.$3-$4'
            ),
            nome: user?.nome,
            instituicao: user?.instituicao?.sigla || 'GERAL',
          },
          process.env.API_KEY || '',
          {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
          }
        ),
        function (err: any, code: any) {
          if (err) {
            reject(reject);
            return;
          }
          resolve(code);
        }
      );
    });

    await pagina.pdf({
      path: pathFile,
      landscape: true,
      printBackground: true,
      format: 'a4',
      displayHeaderFooter: true,
      headerTemplate:
        '<div id="header-template" style="font-size:10px !important; color:#808080; padding-left:10px"></div>',
      footerTemplate: `
      <div style="margin-left: 20px; margin-right: 20px; width: 100vh;">
        <div style="border-top: 1px solid #000; margin-bottom: 10px;"></div>

        <div id="footer-template" style="display: flex; flex-direction: row; justify-content: space-between;">
          <div style="display: flex; flex-direction: row; align-items: center; ">
            <img style="width: 70px; height: 70px;" src="${QRbase64}" />

            <div style="margin-left: 5px;">
              <h1 style="font-size: 12px; font-weight: normal; font-family: Roboto;">Gerado no SISID por: ${
                user?.nome
              }</h1>
              <h1 style="font-size: 12px; font-weight: normal; font-family: Roboto;">Orgão: ${
                user?.instituicao?.sigla || ''
              }</h1>
              <h1 style="font-size: 12px; font-weight: normal; font-family: Roboto;">Em: ${moment().format(
                'DD/MM/YYYY'
              )}</h1>
            </div>
          </div>

          <div style="margin-left: 190px;">
            <h1 style="font-size: 12px; font-weight: normal; font-family: Roboto;">Página: <span class="pageNumber"></span> de <span class="totalPages"></span></h1>
          </div>
        </div>
      </div>
      `,
      margin: { top: 50, bottom: 150, left: 20, right: 20 },
    });
    await browser.close();

    const pdf = {
      input: pathFile,
      output: pathFile,
      password: user?.cpf.substring(0, 5),
    };

    await encrypt(pdf);

    const url = `${process.env.BASE_URL}/files/${filename}`;

    return res.send({ url });
  } catch (error) {
    return res.send(error);
  }
}
