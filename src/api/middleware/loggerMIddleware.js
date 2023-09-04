import chalk from 'chalk';

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
  console.log(`${chalk.magenta(`|${timestamp}|`)} ${chalk.yellow(`API:          Request received: ${method} ${url}`)} `) 
  console.log(`${chalk.green("Request body: ")}`)
  console.log(req_body)

  res.send = function (res_body) {
    if (res_body) {
      
      console.log(`${chalk.green("Response body: ")}`)
      console.log(res_body)
    } 
    originalSend.call(this, res_body);
  };
  next();
};


export { requestLoggerMiddleware }