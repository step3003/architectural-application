import {App} from "./app";
import {LoggerService} from "./logger/logger.service";

import {ExceptionFilter} from "./errors/exception.filter";
import {Container, ContainerModule, interfaces} from "inversify";
import {ILogger} from "./logger/logger.interface";
import {TYPES} from "./types";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {IUserController} from "./users/user.controller.interface";
import {UserController} from "./users/user.controller";
import {IUserService} from "./users/user.service.intreface";
import {UserService} from "./users/user.service";
import {IConfigService} from "./config/config.service.interface";
import {ConfigService} from "./config/config.service";
import {PrismaService} from "./database/prisma.service";
import {UserRepository} from "./users/user.repository";
import {IUserRepository} from "./users/user.repository.interface";

export const AppBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
    bind<IUserService>(TYPES.UserService).to(UserService);
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
    bind<App>(TYPES.Application).to(App);
});

function bootstrap() {
    const appContainer = new Container();
    appContainer.load(AppBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return {app, appContainer};
}

export const {app, appContainer} = bootstrap();