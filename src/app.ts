import express, {Express} from 'express';
import {Server} from 'http';
import {ILogger} from "./logger/logger.interface";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import 'reflect-metadata';
import { json } from 'body-parser';
import {IConfigService} from "./config/config.service.interface";
import {IUserController} from "./users/user.controller.interface";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {UserController} from "./users/user.controller";
import {PrismaService} from "./database/prisma.service";
import {AuthMiddleware} from "./common/auth.middleware";

@injectable()
export class App {
    app: Express;
    server: Server | undefined;
    port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
        @inject(TYPES.ConfigService) private readonly configService: IConfigService,
        @inject(TYPES.PrismaService) private readonly prismaService: PrismaService,
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleware(): void {
        this.app.use(json());
        const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'))
        this.app.use(authMiddleware.execute.bind(authMiddleware));
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
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is started on http://localhost:${this.port}`);
    }
}