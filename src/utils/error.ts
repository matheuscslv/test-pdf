class AppError {
  public readonly message: string;

  public readonly type: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = 400, type = 'error') {
    this.message = message;
    this.statusCode = statusCode;
    this.type = type;
  }
}

export default AppError;
