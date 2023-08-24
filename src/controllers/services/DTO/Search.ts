export default interface ISearch extends Array<Item> { }

interface Item {
  id?: number; 
  rg?: string; 
  digitoRg?: string;
  rgUf?: string;
  nome?: string;
  nomeSocial?: string;
  cpf?:string;
  endereco?: string;
  nome_mae?: string;
  nome_pai?: string;
  data_nascimento?: string;
  sexo?: string;
  cod_nacionalidade?: number;
  cod_naturalidade_ibge?: number;
  descr_naturalidade?: string;
  uf_naturalidade?: string;
  cadastro_biometrico?: boolean;
  pais?: string;
}