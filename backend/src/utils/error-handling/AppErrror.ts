class AppError extends Error {
  constructor(
    public statusCode: number,
    public name: string,
    public message: string,
    public publicAddress: string = "unavailable",
    public data: any = null,
  ) {
    super();
  }

  static badRequest(message: string, name: string = "Bad Request") {
    return new AppError(400, name, message);
  }

  static notAllowed(message: string, name: string = "Not Allowed") {
    return new AppError(401, name, message);
  }

  static notFound(message: string, name: string = "Not Found") {
    return new AppError(404, name, message);
  }

  static internal(
    publicAddress: string,
    message: string,
    name: string = "error",
    data: any = null,
  ) {
    return new AppError(500, name, message, publicAddress, data);
  }
}

export default AppError;
