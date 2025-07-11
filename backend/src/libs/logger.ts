import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const transportOptions =
  process.env.NODE_ENV === "production"
    ? new transports.File({
        filename: "logs/application-%DATE%.log",
        level: "info",
        handleExceptions: true,
        format: combine(timestamp(), logFormat),
      })
    : new transports.Console({
        level: "debug",
        handleExceptions: true,
        format: combine(colorize(), timestamp(), logFormat),
      });

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp(), logFormat),
  transports: transportOptions,
  exitOnError: false,
});

export default logger;
