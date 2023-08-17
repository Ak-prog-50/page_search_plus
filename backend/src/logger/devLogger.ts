import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const devLogger = () => {
  return createLogger({
    level: "silly",
    format: combine(
      format.colorize(),
      label({ label: "dev_logger" }),
      timestamp({ format: "HH:mm:ss" }),
      myFormat,
    ),

    transports: [new transports.Console()],
  });
};

export default devLogger;
export { myFormat };
