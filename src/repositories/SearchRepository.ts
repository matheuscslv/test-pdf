import https from 'https';

import ISearch from '../controllers/services/DTO/Search';
import { ISearchRepository } from './interfaces/ISearchRepository';
import config from '../config/apis';
import { v4 as uuidV4 } from 'uuid';
var querystring = require('querystring');
const axios = require('axios');

class SearchRepository implements ISearchRepository {
  async findINRC(texto: string, dt_ocorrencia: string, dt_nascimento: string, quantidade_por_pagina: bigint, pagina_atual: bigint): Promise<ISearch> {
    // TODO: trocar pro cpf do usuario que esta consultando no govbr
    var cpfUsuario = "04948920215";

    //////////////////////////////////
    // get token
    //////////////////////////////////
    var inrc_url = config.incr_url;
    var inrc_client = config.incr_client;
    var inrc_secret = config.incr_secret;

    var postData = {
      client_id: inrc_client,
      client_secret: inrc_secret,
    }

    const access = await axios.post('https://' + inrc_url + '/sic/api/v1/detalhada', postData,
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Host': 'sic-inrc.portal.ap.gov.br',
        }
      }
    );
    var access_token = access.data.access_token ?? null;

    //////////////////////////////////
    // get list
    //////////////////////////////////
    if (access_token) {
      var pesquisaPorNome = false;

      var postBody: { [k: string]: any } = {};
      postBody = {
        "idUsuario": "msb",
        "cpfUsuario": cpfUsuario,
        "sistemaOrigem": "sisid",
        "quantidadePorPagina": quantidade_por_pagina ?? 10,
        "paginaAtual": pagina_atual ?? 0,
      };

      if (dt_nascimento != "") {
        postBody.dataNascimento = dt_nascimento;
      }

      //remover caracteres especiais
      texto = texto.replace(/[^a-zA-Z0-9 ]/g, '');
      if (texto.length < 11 && Number.isInteger(parseInt(texto))) {
        postBody.Rg = texto;
      } else if (texto.length == 11 && Number.isInteger(parseInt(texto))) {
        postBody.Cpf = texto;
      } else {
        postBody.nomeRegistroCivil = texto.toUpperCase();
        pesquisaPorNome = true;
      }
      var postBodyStr = JSON.stringify(postBody)

      var retorno: any[] | ISearch = [];

      var retornoPrincipal = await axios.post('https://' + inrc_url + '/sic/api/v1/detalhada/nivel1', postBody,
      {
        timeout: 10000,
        headers: {
          'x-access-token': access_token,
          'Content-Type': 'application/json',
          'Host': 'sic-inrc.portal.ap.gov.br',
          'Content-Length': postBodyStr.length,
        }
      }
      ).then((response: { data: any; }) => (retornoPrincipal = response.data));
      if (retornoPrincipal != null)
        retorno = retorno.concat(retornoPrincipal);

      if (pesquisaPorNome) {
        var postBodyPai = {
          "idUsuario": "msb",
          "cpfUsuario": cpfUsuario,
          "sistemaOrigem": "sisid",
          "quantidadePorPagina": quantidade_por_pagina ?? 10,
          "paginaAtual": pagina_atual ?? 0,
          "nomePai": texto.toUpperCase(),
        };
        var postBodyPaiStr = JSON.stringify(postBodyPai)
        var { retornoPai } = await axios.post('https://' + inrc_url + '/sic/api/v1/detalhada/nivel1', postBodyPai,
          {
            timeout: 10000,
            headers: {
              'x-access-token': access_token,
              'Content-Type': 'application/json',
              'Host': 'sic-inrc.portal.ap.gov.br',
              'Content-Length': postBodyPaiStr.length,
            }
          }
        ).then((response: { data: any; }) => (retornoPai = response.data));
        if (retornoPai != null)
          retorno = retorno.concat(retornoPai);

        var postBodyMae = {
          "idUsuario": "msb",
          "cpfUsuario": cpfUsuario,
          "sistemaOrigem": "sisid",
          "quantidadePorPagina": quantidade_por_pagina ?? 10,
          "paginaAtual": pagina_atual ?? 0,
          "nomeMae": texto.toUpperCase(),
        };
        var postBodyMaeStr = JSON.stringify(postBodyMae)
        var { retornoMae } = await axios.post('https://' + inrc_url + '/sic/api/v1/detalhada/nivel1', postBodyMae,
          {
            timeout: 10000,
            headers: {
              'x-access-token': access_token,
              'Content-Type': 'application/json',
              'Host': 'sic-inrc.portal.ap.gov.br',
              'Content-Length': postBodyMaeStr.length,
            }
          }
        ).then((response: { data: any; }) => (retornoMae = response.data));
        if (retornoMae != null)
          retorno = retorno.concat(retornoMae);
      }

      var resultados: ISearch = [];

      retorno.forEach((element: any) => {
        resultados.push({
          rg: element.numRG || "",
          cpf: element.cpf || "",
          nome: element.nomeRegistroCivil || "",
          endereco: '',
          nome_mae: element.filiacao[0].split('(mae)')[0].split('), ')[1]?.includes('pai') ? "" : element.filiacao[0].split('(mae)')[0].split('), ')[1],
          nome_pai: element.filiacao[0].split('(pai)')[0].split(', ')[1] || "",
          data_nascimento: element.dataNascimento || "",
          sexo: element.sexo || "",
          pais: element.pais || "",
          uf_naturalidade: element.ufNaturalidade || "",
          descr_naturalidade: element.descrNaturalidade || "",
          cod_nacionalidade: element.codNacionalidade || "",
          cod_naturalidade_ibge: element.codNaturalidadeIBGE || "",
          cadastro_biometrico: element.cadastroBiometrico || "",
        });
      });

      return resultados as ISearch;
    } else {
      throw new Error('INRC: Erro ao requisitar access_token');
    }
  }
}

export { SearchRepository };
