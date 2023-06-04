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
import {sign} from 'jsonwebtoken';
import {IConfigService} from "../config/config.service.interface";
import {AuthGuard} from "../common/auth.guard";


@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.ConfigService) private configService: IConfigService,
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: "/register",
                method: "post",
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)]
            },
            {
                path: "/login",
                method: "post",
                func: this.login,
                middlewares: [new ValidateMiddleware(UserLoginDto)]
            },
            {
                path: "/info",
                method: "get",
                func: this.info,
                middlewares: [new AuthGuard()]
            }
        ])
    }

    async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.validateUser(req.body);
        if (!result) {
            return next(new HttpError(401, 'Error login'));
        }
        const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
        this.ok(res, 200, {jwt});
    }

    async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.create(body);
        if (!result) {
            return next(new HttpError(422, 'User already exists'))
        }
        
        const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
        this.ok(res, 200, {id: result.id, email: result.email, token: jwt});
    }

    async info({user}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const gotUser = await this.userService.getUserInfo(user);
        if (!gotUser) {
            return next(new HttpError(404, 'Not found'))
        }

        this.ok(res, 200, {id: gotUser.id, name: gotUser.name, email: gotUser.email});
    }

    private signJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
           sign({
               email,
               iat: Math.floor(Date.now() / 1000),
           }, secret, {
               algorithm: "HS256"
           }, (err, token) => {
               if (err) {
                   reject(err);
               }
               resolve(token as string);
           });
        });
    }
}