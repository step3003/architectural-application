import express, {Express} from 'express';
import {Server} from 'http';
import {UserController} from "./users/user.controller";
import {ExceptionFilter} from "./errors/exception.filter";
import {ILogger} from "./logger/logger.interface";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import 'reflect-metadata';
import { json } from 'body-parser';

@injectable()
export class App {
    app: Express;
    server: Server | undefined;
    port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleware(): void {
        this.app.use(json());
    }

    public useRoutes() {
        this.app.use('/users', this.userController.router)
    }

    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init() {
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is started on http://localhost:${this.port}`);
    }
}