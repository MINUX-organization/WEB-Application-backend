import Sequelize from 'sequelize';

export const sequelize = new Sequelize(
  {
    // logging: msg => loggerConsole.database(msg),
    logging: false,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
        useUTC: false, 
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    timezone : process.env.DB_TIMEZONE
  }
)
