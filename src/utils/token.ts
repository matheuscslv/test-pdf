import { sign, verify } from 'jsonwebtoken';

interface IUserData {
  nome: string;
  cpf: string;
  id: string;
}

class Token {
  public static async encode({ cpf, id, nome }: IUserData): Promise<string> {
    const token = sign({ cpf, id, nome }, process.env.API_KEY || '', {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    return token;
  }

  public static async encodeAll(data: any): Promise<string> {
    const token = sign(data, process.env.API_KEY || '', {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
    });

    return token;
  }

  public static async decode(token: string): Promise<IUserData> {
    const { cpf, id, nome } = verify(
      token,
      process.env.API_KEY || ''
    ) as IUserData;

    return {
      nome,
      cpf,
      id,
    };
  }
}

export { Token };
