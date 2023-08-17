// const winston = require('winston')

import { createLogger, format, transports } from "winston";
const { combine, timestamp, json } = format;

const prodLogger = () => {
  return createLogger({
    level: "info",
    format: combine(timestamp(), json()),

    transports: [
      new transports.File({
        filename: "logs/errors.log",
        level: "error",
      }),
      new transports.File({ filename: "logs/combined.log" }),
    ],
  });
};

export default prodLogger;
