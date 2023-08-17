import { winston_format } from "../../config";
import logger from "../../logger";
import { INext } from "../../types/vendor/INext";
import { IRequest } from "../../types/vendor/IRequest";
import { IResponse } from "../../types/vendor/IResponse";
import AppError from "./AppErrror";

function appErrorHandler(
  err: unknown,
  req: IRequest,
  res: IResponse,
  next: INext,
): void {
  if (err instanceof AppError) {
    if (err.name === "Internal Error") {
      logger.error(winston_format("", err.message));
    }
    res.status(err.statusCode).json({ error: err.name, message: err.message });
    return;
  }
  logger?.error(winston_format("unavailable", "Unhandled Error\n"), err);
  res.status(500).json({ error: "error", message: "Something went wrong!" });
}

export default appErrorHandler;
