import AppError from "../utils/error-handling/AppErrror";

type TRequestProperty = string | undefined;

interface IinteractorReturn<T = unknown> {
  appError: AppError | null;
  sucessData: T | null;
}

function isIinteractorReturn(value: any): value is IinteractorReturn {
  return (
    typeof value === "object" &&
    (value.appError === null || value.appError instanceof AppError) &&
    (value.successData === null || typeof value.successData !== "undefined")
  );
}

export { TRequestProperty, IinteractorReturn, isIinteractorReturn };
