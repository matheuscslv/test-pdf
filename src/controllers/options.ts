import { Request, Response } from 'express';

export async function options(req: Request, res: Response) {
  try {
    return res.status(200).json({
      rg: false,
      digitoRg: false,
      rgUF: false,
      nome: true,
      nome_mae: false,
      nome_pai: false,
      data_nascimento: false,
      sexo: false,
      cod_naturalidade_ibge: false,
      descr_naturalidade: false,
      cod_nacionalidade: false,
      uf_naturalidade: false,
      cpf: false,
      cadastro_biometrico: false,
      pais: false,

      idUF: false,
      nomeSocial: false,
      dadosCertidao: false,
      tipoCertidao: false,
      cnh: false,
      cns: false,
      TituloEleitor: false,
      pispasep: false,
      certidaoMilitar: false,
      ctps: false,
      cip: false,
      indSaudeFisica: false,
      indSaudeIntelectual: false,
      indSaudeVisual: false,
      indSaudeAuditiva: false,
      indSaudeAutismo: false,
      indTipoSanguineo: false,
      indSaudeObservacao: false,
      dataEmissao: false,
      cedulaEmissao: false,
      viaEmissao: false,

      termoPesquisa: "",
      dataOcorrencia: null,
      dataNascimento: null,
      advancedSearch: false
    });
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}
