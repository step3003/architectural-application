import {Logger} from 'tslog';
import {ILogger} from "./logger.interface";
import {injectable} from "inversify";
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
    public logger: Logger<any>;

    constructor() {
        this.logger = new Logger<any>();
    }

    log(...arg: unknown[]) {
        this.logger.info(...arg);
    }

    error(...arg: unknown[]) {

        this.logger.error(...arg);
    }

    warn(...arg: unknown[]) {
        this.logger.warn(...arg);
    }
}