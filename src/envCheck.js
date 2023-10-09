import dotenv from 'dotenv'
dotenv.config()

function assertEnv(key) {
  if(process.env[key] === undefined) {
    throw new Error(`${key} is undefined, you should set it inside .env file`)
  }
}

[
  'PORT',
  'DB_NAME',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DIALECT',
  'DB_HOST',
  'DB_PORT',
  'DB_TIMEZONE'
].map(key => assertEnv(key))
