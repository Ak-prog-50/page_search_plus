//Note: Use logger with optional chaining. ex: logger?.info("message")

import winston from "winston";
import { NODE_ENVS } from "../config";
import devLogger from "./devLogger";
import prodLogger from "./prodLogger";

// {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// }

let logger: winston.Logger;

if (process.env.NODE_ENV === NODE_ENVS.dev) {
  logger = devLogger();
} else if (process.env.NODE_ENV === NODE_ENVS.prod) {
  logger = prodLogger();
} else throw new Error("NODE_ENV not set");

export default logger;
