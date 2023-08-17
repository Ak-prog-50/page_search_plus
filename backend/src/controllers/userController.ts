import { createUser as createUserInteractor } from "../interactors/user.interactor";
import AppResponse from "../utils/AppResponse";
import AppError from "../utils/error-handling/AppErrror";
import errHandlerAsync from "../utils/error-handling/errHandlerAsync";
import { IinteractorReturn } from "../types/generalTypes";
import appErrorHandler from "../utils/error-handling/appErrorHandler";
import { saveUser } from "../data-access/user.db";
import { validateStrings } from "../utils/validateReqProperties";
import { IUserDocument } from "../data-access/models/userModel";
import { TExpressAsyncCallback } from "../types/expressTypes";

/**
 * @type {TExpressAsyncCallback} An Express middleware function that will be passed into 'create-user' route.
 */
const createUserController: TExpressAsyncCallback = async (req, res, next) => {
  let { username, password, email } = req.body;

  // validating req.body properties
  const inputStrings: (string | undefined)[] = [username, password, email];
  if (!validateStrings(inputStrings)) {
    AppError.badRequest("Invalid request");
    return;
  }
  [username, password, email] = inputStrings;

  // This object containing related db functions will be injected to interactor.
  const createUserDB = {
    saveUser,
  };
  const [result, unHandledErr] = await errHandlerAsync<
    IinteractorReturn<IUserDocument>
  >(createUserInteractor(username, password, email, createUserDB));
  if (unHandledErr !== null) {
    appErrorHandler(unHandledErr, req, res, next);
    return;
  } else if (result !== null) {
    const { appError, sucessData: createdUser } = result;
    if (appError === null && createdUser !== null) {
      AppResponse.created(res, "User created", createdUser);
      return;
    }
    if (appError instanceof AppError) {
      appErrorHandler(appError, req, res, next);
      return;
    }
  }
};

export { createUserController };
