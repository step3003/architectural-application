import {Logger} from "tslog";

export interface ILogger {
    logger: Logger<any>;
    log: (...arg: unknown[]) => void;
    error: (...arg: unknown[]) => void;
    warn: (...arg: unknown[]) => void;
}