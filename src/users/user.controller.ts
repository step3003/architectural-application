import {BaseController} from "../common/base.controller";
import {NextFunction, Request, Response} from "express";
import {HttpError} from "../errors/http-error.class";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";
import 'reflect-metadata';
import {IUserController} from "./user.controller.interface";
import {UserLoginDto} from "./dto/user-login.dto";
import {UserRegisterDto} from "./dto/user-register.dto";
import {IUserService} from "./user.service.intreface";
import {ValidateMiddleware} from "../common/validate.middleware";

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UserService) private userService: IUserService
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: "/register",
                method: "post",
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)]
            },
            {path: "/login", method: "post", func: this.login}
        ])
    }

    login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
        console.log(req.body)
        next(new HttpError(401, 'Error login'));
    }

    async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.create(body);
        if (!result) {
            return next(new HttpError(422, 'User already exists'))
        }
        this.ok(res, 200, {email: result.email});
    }
}