import { IResponse } from "../types/vendor/IResponse";

class AppResponse {
  static success(res: IResponse, message: string, data: unknown = null) {
    res.status(200).json({ message, data });
  }

  static created(res: IResponse, message: string, data: unknown = null) {
    res.status(201).json({ message, data });
  }
}

export default AppResponse;
