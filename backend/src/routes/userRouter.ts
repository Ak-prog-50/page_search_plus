import { Router } from "express";
import { createUserController } from "../controllers/userController";
import wrapAsyncExpress from "../utils/error-handling/wrapAsyncExpress";

export default function userRouter() {
  const router = Router();
  router.post("/create-user", wrapAsyncExpress(createUserController));

  return router;
}
