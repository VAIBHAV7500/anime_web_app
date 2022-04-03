/** @module */
/* eslint-disable no-param-reassign */

// process.env.FORCE_COLOR = 1; // Needed for making chalk.js work.
// const chalk = require('chalk');
const winston = require('winston');
const PrettyError = require('pretty-error');
const { format } = require('winston');
require('winston-daily-rotate-file');

const pe = new PrettyError();

// Needed for processing errors
const enumerateErrorFormat = format((info) => {
  if (info.message instanceof Error) {
    info.message = {
      message: info.message.message,
      stack: info.message.stack,
      ...info.message,
    };
  }

  if (info instanceof Error) {
    return {
      message: info.message,
      stack: info.stack,
      ...info,
    };
  }

  return info;
});

const prettyPrintConsole = format((info) => {
  // Show Errors in Color
  if (info.message instanceof Error) {
    info.message = pe.render(info.message);
  } else if (info instanceof Error) {
    info.message = pe.render(info);
  }

  if (info.metadata && info.metadata.type === 'morgan') {
    const m = JSON.parse(info.message);
    info.message = `${m.timestamp} ${m.method} :: ${m.url} - ${m.status} (${m.response_time} ms) `;
  }

  // Show SQL Execution in color
  if (info.metadata && info.metadata.type === 'sql') {
    info.message = chalk.grey(info.message);
  }
  return info;
});

const getLogger = (path) => {
  // define the custom settings for each transport (file, console)
  const consoleOptions = {
    level: 'debug',
    handleExceptions: true,
    json: false,
    timestamp: true,
    colorize: true,
    format: format.combine(prettyPrintConsole(), format.cli()),
  };

  let logger = null;

  // instantiate a new Winston Logger with the settings defined above
  logger = winston.createLogger({
    transports: [new winston.transports.Console(consoleOptions)],
    exitOnError: false, // do not exit on handled exceptions
  });

  // create a stream object with a 'write' function that will be used by `morgan`
  logger.stream = {
    write(message) {
      // use the 'info' log level so the output will be picked up by both transports
      // (file and console)
      logger.info(message);
    },
  };

  logger.pp = (obj) => {
    logger.info(JSON.stringify(obj, 0, 2));
  };

  // Needed for making log.error work with error objects
  logger.error = (message) => {
    logger.log({ level: 'error', message });
  };
  logger.warn = (message) => {
    logger.log({ level: 'warn', message });
  };
  logger.info = (message) => {
    logger.log({ level: 'info', message });
  };
  logger.verbose = (message) => {
    logger.log({ level: 'verbose', message });
  };
  logger.debug = (message) => {
    logger.log({ level: 'debug', message });
  };
  logger.silly = (message) => {
    logger.log({ level: 'silly', message });
  };

  logger.sequelize = (instance) => (message) => {
    if (!disableSequelizeLogging) {
      logger.log({ level: 'info', message: `${instance}-${message}`, metadata: { type: 'sql' } });
    }
  };
  return logger;
};

const logger = getLogger();

module.exports = {
  logger,
  getLogger,
  winston,
};
