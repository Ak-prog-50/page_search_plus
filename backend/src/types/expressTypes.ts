import { INext } from "./vendor/INext";
import { IRequest } from "./vendor/IRequest";
import { IResponse } from "./vendor/IResponse";

type TExpressCallback = (req: IRequest, res: IResponse, next: INext) => void;

type TExpressAsyncCallback = (
  req: IRequest,
  res: IResponse,
  next: INext,
) => Promise<void>;

export { TExpressCallback, TExpressAsyncCallback };
