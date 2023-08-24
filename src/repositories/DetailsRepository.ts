import https from 'https';

import IDetails from '../controllers/services/DTO/Details';
import { IDetailsRepository } from './interfaces/IDetailsRepository';
import config from '../config/apis';
import { v4 as uuidV4 } from 'uuid';
var querystring = require('querystring');
const axios = require('axios');

class DetailsRepository implements IDetailsRepository {
  async findINRC(rg: string): Promise<IDetails> {
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
      var postBody = {
        "numRG": rg,
      };

      var getQuery = querystring.stringify(postBody)

      var retorno: any[] | IDetails = [];

      var retornoPrincipal = await axios.get('https://' + inrc_url + '/sic/api/v1/detalhada?'+getQuery,
      {
        timeout: 10000,
        headers: {
          'x-access-token': access_token,
          'Accept': '*/*',
          'Host': 'sic-inrc.portal.ap.gov.br',
        }
      }
      ).then((response: { data: any; }) => (retornoPrincipal = response.data));
      console.log(retornoPrincipal);


      return {
        ...retornoPrincipal,
        rg: retornoPrincipal.numRG || "",
        cpf: retornoPrincipal.cpf || "",
        nome: retornoPrincipal.nomeRegistroCivil || "",
        endereco: '',
        nome_mae: retornoPrincipal.filiacao.filter((item: any) => item.tipofiliacao == 'MAE').length > 0 ? retornoPrincipal.filiacao.filter((item: any) => item.tipofiliacao == 'MAE')[0]?.nome : "",
        nome_pai: retornoPrincipal.filiacao.filter((item: any) => item.tipofiliacao == 'PAI').length > 0 ? retornoPrincipal.filiacao.filter((item: any) => item.tipofiliacao == 'PAI')[0]?.nome : "",
        data_nascimento: retornoPrincipal.dataNascimento || "",
        sexo: retornoPrincipal.sexo || "",
        pais: retornoPrincipal.pais || "",
        uf_naturalidade: retornoPrincipal.ufNaturalidade || "",
        descr_naturalidade: retornoPrincipal.descrNaturalidade || "",
        cod_nacionalidade: retornoPrincipal.codNacionalidade || "",
        cod_naturalidade_ibge: retornoPrincipal.codNaturalidadeIBGE || "",
        cadastro_biometrico: retornoPrincipal.cadastroBiometrico || "",
      } as IDetails;
    } else {
      throw new Error('INRC: Erro ao requisitar access_token');
    }
  }
}

export { DetailsRepository };
