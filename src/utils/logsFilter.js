import winston from 'winston';

const errorFilter = winston.format((info, opts) => {
    return info.level === 'error' ? info : false;
})

const httpFilter = winston.format((info, opts) => {
    return info.level === 'HTTP' ? info : false;
})

const dataFilter = winston.format((info, opts) => {
    return info.level === 'data' ? info : false;
})

const databaseFilter = winston.format((info, opts) => {
    return info.level === 'database' ? info : false;
})

const basicInfoFilter = winston.format((info, opts) => {
    return info.level === 'basicInfo' ? info : false;
})


export { errorFilter, httpFilter, dataFilter, databaseFilter, basicInfoFilter }