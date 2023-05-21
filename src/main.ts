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

export const AppBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IUserController>(TYPES.UserController).to(UserController);
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    bind<IUserService>(TYPES.UserService).to(UserService);
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