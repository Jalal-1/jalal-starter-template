import pino from 'pino';
import { loadRuntimeConfiguration } from '../config/runtime-config';

const config = loadRuntimeConfiguration();

const logger = pino({
    level: config.LOGGING_LEVEL,
    timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
