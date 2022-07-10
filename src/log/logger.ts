import winston = require('winston');

export const logger = winston.createLogger({
    levels: winston.config.npm.levels,

    format: winston.format.combine(
        winston.format.colorize(),
        // winston.format.timestamp({
        //     format: 'YYYY-MM-DD HH:mm:ss',
        // }),
        winston.format.splat(),
        winston.format.simple(),
    ),
    transports: [new winston.transports.Console()],
});

/**
 * Send log in level INFO to logger queue and to local logger
 * @param msg - explanation of logger
 * @param any - objet to add to msg
 */
export const logInfo = (msg: string, any?: any) => {
    logs('info', msg, any);
};

/**
 * Send log in level warn to logger queue and to local logger
 * @param msg - explanation of logger
 * @param any - objet to add to msg
 */
export const logWarn = (msg: string, any?: any) => {
    logs('warn', msg, any);
};

/**
 * Send log in level ERROR to logger queue and to local logger
 * @param msg - explanation of logger
 * @param any - objet to add to msg
 */
export const logError = (msg: string, any?: any) => {
    logs('error', msg, any);
};

export const logs = (level: string, msg: string, any?: any) => {
    logger[level](`${msg}${!any ? '' : ' ' + JSON.stringify(any)}`);
};
