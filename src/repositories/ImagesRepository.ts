import https from 'https';
import IImages from '../controllers/services/DTO/Images';
import { IImagesRepository } from './interfaces/IImagesRepository';
import config from '../config/apis';
import { v4 as uuidV4 } from 'uuid';
var querystring = require('querystring');
const axios = require('axios');
const extractUrls = require("extract-urls");

class ImagesRepository implements IImagesRepository {
  async findINRC(rg: string): Promise<IImages> {
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
        "descricaoImagem": "TODAS",
      };

      var getQuery = querystring.stringify(postBody)

      var retorno: IImages | any = [];

      var retornoPrincipal = await axios.get('https://' + inrc_url + '/sic/api/v1/detalhada/imagem?'+getQuery, 
      {
        timeout: 10000,
        headers: {
          'x-access-token': access_token,
          'Accept': '*/*',
          'Host': 'sic-inrc.portal.ap.gov.br',
        }
      }
      ).then((response: { data: any; }) => (retornoPrincipal = response.data));

      // console.log(retornoPrincipal); //900095
      if (retornoPrincipal != "<!DOCTYPE =html><html><head><content-type:image></content-type:image></head><body><div></div></body></html>") { //empty response
        retornoPrincipal = retornoPrincipal.replace(/&amp;/g, '&');
        let urls = extractUrls(retornoPrincipal) as Array<string>;
        if (urls.length > 0) {
          // urls to IImages 
          let i = 0;
          urls.forEach((url: string) => {
            retorno[i] = {
              url: url,
            };
            i++;
          });
        }
      }

      return retorno;
    } else {
      throw new Error('INRC: Erro ao requisitar access_token');
    }
  }
}

export { ImagesRepository };
