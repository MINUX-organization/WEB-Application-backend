import chalk from 'chalk';
import { loggerConsole } from '../../utils/logger.js';

const requestLoggerMiddleware = (req, res, next) => {
  const { method, url, } = req;
  const req_body = req.body
  const originalSend = res.send; 
  //
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
  //
  loggerConsole.data(`${chalk.magenta(`|${timestamp}|`)} ${chalk.yellow(`API:          Request received: ${method} ${url}`)} `) 
  loggerConsole.data(`${chalk.green("Request body: ")}`)
  try {
    loggerConsole.data(JSON.stringify(JSON.parse(req_body), null, 2))
  } catch(e) {
    loggerConsole.data(req_body)
  }

  res.send = function (res_body) {
    if (res_body) {
      
      loggerConsole.data(`${chalk.green("Response body: ")}`)
      try {
        loggerConsole.data(JSON.stringify(JSON.parse(res_body), null, 2))
      } catch(e) {
        loggerConsole.data(res_body)
      }
    } 
    originalSend.call(this, res_body);
  };
  next();
};

export { requestLoggerMiddleware }
