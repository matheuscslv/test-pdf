import axios from 'axios';
import { Request, Response } from 'express';
// import http from 'http';
import { container } from 'tsyringe';

import { LoginService } from './services/LoginService';

export async function auth(req: Request, res: Response) {
  try {
    /* const headers = {
      'Content-Type': 'application/json',
    }; */

    /* const optionsValidate = {
      host: 'controlador-homolog.portal.ap.gov.br',
      path: `/api/validar_cidadao/`,
      method: 'POST',
      headers,
    };

    const validate = (options: any) =>
      new Promise((resolve, reject) => {
        const request = http.request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            resolve(JSON.parse(data));
          });
        });

        request.on('error', (err) => {
          reject(err);
        });

        request.write(
          JSON.stringify({
            redirect_uri: `${process.env.URL_CALLBACK}/sso/callback/`,
            code: req.query.code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
          })
        );

        request.end();
      }); */

    // const { access_token }: any = await validate(optionsValidate);

    const response = await axios.post(
      `${
        process.env.URL_GOV || 'http://controlador-homolog.portal.ap.gov.br'
      }/api/validar_cidadao/`,
      {
        redirect_uri: `${
          process.env.URL_CALLBACK || 'http://sisid.msbtec.dev'
        }/sso/callback/`,
        code: req.query.code,
        client_id: process.env.CLIENT_ID || 'sisid.msbtec.dev',
        client_secret:
          process.env.CLIENT_SECRET ||
          'Xu9K9ntsJyVCQBhya8ufy9J0F1V7bHPfmcyVKa1CJnG1F7zChg17hvWFNOBoXr13oQ3hdXiWSOjW0kfcyrbxICI19KSE4BIQsk2A4SaKrXaHmvke4CEfrCs8vQKuPVNr',
      }
    );

    const { access_token } = response.data;

    /* const optionsUser = {
      host: 'controlador-homolog.portal.ap.gov.br',
      path: `/api/cidadaos/pro/`,
      method: 'GET',
      headers: {
        ...headers,
        Authorization: `Bearer ${access_token}`,
      },
    };

    const getUser = (options: any) =>
      new Promise((resolve, reject) => {
        http
          .request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
              data += chunk;
            });

            res.on('end', () => {
              resolve(JSON.parse(data));
            });
          })
          .on('error', (err) => {
            reject(err);
          })
          .end();
      });

    const data: any = await getUser(optionsUser); */

    const { data } = await axios.get(
      `${
        process.env.URL_GOV || 'http://controlador-homolog.portal.ap.gov.br'
      }/api/cidadaos/pro/`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const loginService = container.resolve(LoginService);
    const user = await loginService.login(data[0]);

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ error });
  }
}
