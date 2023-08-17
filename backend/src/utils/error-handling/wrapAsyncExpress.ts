import {
  TExpressAsyncCallback,
  TExpressCallback,
} from "../../types/expressTypes";
import appErrorHandler from "./appErrorHandler";

/**
 * reduces boilerplate and handle errors.
 */
function wrapAsyncExpress(fn: TExpressAsyncCallback): TExpressCallback {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => appErrorHandler(e, req, res, next));
  };
}

export default wrapAsyncExpress;
