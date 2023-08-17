import express, { NextFunction } from "express";
import cors from "cors";
import { GET_FRONTEND_URL } from "./config";
import { IRequest } from "./types/vendor/IRequest";
import { IResponse } from "./types/vendor/IResponse";
import userRouter from "./routes/userRouter";
import AppError from "./utils/error-handling/AppErrror";
import appErrorHandler from "./utils/error-handling/appErrorHandler";
import { dbConnect } from "./services/database";
const { PORT } = process.env;
const app = express();

// Initial setup for server
app.use(
  cors({
    credentials: true,
    origin: [GET_FRONTEND_URL()],
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Content-Type",
      "Origin",
    ],
  }),
);
app.use(express.json());

// Map routes
app.get("/", (req: IRequest, res: IResponse) => {
  return res.status(200).json({ message: "Server is Running" });
});

app.use("/user", userRouter());

app.all("*", (req: IRequest, res: IResponse, next: NextFunction): void => {
  appErrorHandler(AppError.notFound("Route not found"), req, res, next);
});

// Start database connection and server
if (require.main === module) {
  (async function () {
    await dbConnect();
    app.listen(PORT, () => {
      console.info(`Server is running on port ${PORT}`);
    });
  })();
}
