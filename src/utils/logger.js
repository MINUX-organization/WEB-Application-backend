import winston from 'winston';
import winston_daily_rotate_file from 'winston-daily-rotate-file'
import winstonTimestampColorize from 'winston-timestamp-colorize'
import os from 'os'

import { errorFilter, httpFilter, dataFilter, databaseFilter, basicInfoFilter } from './logsFilter.js';
const { combine, timestamp, json, colorize, align, printf} = winston.format;
let pathLogs = ''

if (os.platform() === 'win32') {
    pathLogs = 'C:\\MINUX\\logs\\'
}
if (os.platform() === 'linux') {
    pathLogs = './logger/logs/' // TODO
}

const customLevels = {
    levels: {
        error : 0,
        HTTP: 1,
        data: 2,
        database: 3,
        basicInfo: 4,
    },
    colors: {
        error : 'red',
        HTTP: 'yellow',
        data: 'blue',
        database: 'green',
        basicInfo: 'white',
    }
}
winston.addColors(customLevels.colors)


const loggerFile = winston.createLogger({
    levels: customLevels.levels,
    transports: [
    new winston.transports.File({
        filename: `${pathLogs}error.log`,
        level: 'error',
        format: combine(
            errorFilter(),
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS',
            }),
            json()
        ),
    }),
    new winston.transports.File({
        filename: `${pathLogs}http.log`,
        level: 'HTTP',
        format: combine(
            httpFilter(),
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS',
            }),
            json()
        ),
    }),
    new winston.transports.File({
        filename: `${pathLogs}data.log`,
        level: 'data',
        format: combine(
            dataFilter(),
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS',
            }),
            json()
        ),
    }),
    new winston.transports.File({
        filename: `${pathLogs}database.log`,
        level: 'database',
        format: combine(
            databaseFilter(),
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS',
            }),
            json()
        ),
    }),
    new winston.transports.File({
        filename: `${pathLogs}basicInfo.log`,
        level: 'basicInfo',
        format: combine(
            basicInfoFilter(),
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS',
            }),
            json()
        ),
    }),
    ],
})

const loggerConsole = winston.createLogger({
    levels: customLevels.levels,
    transports: [new winston.transports.Console({
        level: 'basicInfo',
        format: combine(
            colorize({all: true}),
            timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS'
            }),
            winstonTimestampColorize({color: 'magenta'}),
            align(),
            printf((info) => `|${info.timestamp}| ${info.level}:  ${info.message}`)
        )
    })],
});



export { loggerConsole, loggerFile } 
