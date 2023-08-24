export default interface IDetails extends Array<Item> { }

export interface Item {
  idUF?: string
  numRG?: number
  rgUF?: string
  nomeRegistroCivil?: string
  nomeSocial?: any
  filiacao?: Filiacao[]
  dataNascimento?: string
  sexo?: string
  codNacionalidade?: number
  codNaturalidadeIbge?: number
  descrNaturalidade?: string
  ufNaturalidade?: string
  pais?: string
  cpf?: number
  cadastroBiometrico?: string
  dadosCertidao?: string
  tipoCertidao?: string
  cnh?: any
  cns?: any
  TituloEleitor?: any
  pispasep?: any
  certidaoMilitar?: any
  ctps?: any
  cip?: any
  indSaudeFisica?: string
  indSaudeIntelectual?: string
  indSaudeVisual?: string
  indSaudeAuditiva?: string
  indSaudeAutismo?: string
  indTipoSanguineo?: any
  indSaudeObservacao?: any
  dataEmissao?: string
  cedulaEmissao?: string
  viaEmissao?: string
}

export interface Filiacao {
  nome?: string
  tipofiliacao?: string
}
