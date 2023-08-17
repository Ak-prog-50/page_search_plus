import { winston_format } from "../../config";
import logger from "../../logger";

/**
 * @description reduces the try catch boilerplate of error handling in async functions.
 * @returns an array of two elements, the first element is the result of the async function, the second element is the error.
 * @param functionCallPromise - the promise to be handled
 * @param logError - whether to log the error. default is true.
 * @param logMsg - custom error message to be logged if an error.
 * @example
 * const [result, unHandledErr] = await errHandlerAsync(promise);
 * if (unHandledErr) console.error(unHandledErr)
 */
async function errHandlerAsync<T>(
  functionCallPromise: Promise<T>,
  logError = true,
  logMsg = "caught error",
): Promise<[T | null, unknown]> {
  try {
    const result = await functionCallPromise;
    return [result, null];
  } catch (err) {
    if (logError) logger.error(winston_format("", logMsg), err);
    return [null, err];
  }
}

export default errHandlerAsync;

// spec test
if (require.main === module) {
  const doesFail = true;
  (async () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        doesFail ? reject(new Error("ERROR!")) : resolve("SUCCESS!");
      }, 1);
    });
    const [result, err] = await errHandlerAsync(promise);
    console.log("\n", "result: ", result, "\n", "err: ", err);
  })();
}
