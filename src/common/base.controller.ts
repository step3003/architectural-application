
import {NextFunction, Response, Router, RequestHandler} from 'express';
import {IControllerRoute} from "./route.interface";
import {ILogger} from "../logger/logger.interface";
import {injectable} from "inversify";
import 'reflect-metadata';
import {IMiddleware} from "./middleware.interface";

@injectable()
export abstract class BaseController {
    private readonly _router: Router;

    constructor(private logger: ILogger) {
        this._router = Router();
    }

    get router() {
        return this._router;
    }

    public created(res: Response) {
        return res.sendStatus(201);
    }

    public send<T>(res: Response, code: number, message: T) {
        res.type('application/json');
        return res.status(200).json(message);
    }

    public ok<T>(res: Response, code: number, message: T) {
        return this.send<T>(res, 200, message);
    }

    protected bindRoutes(routes: IControllerRoute[]) {
        for (const route of routes) {
            this.logger.log(`[${route.method}] ${route.path}`);
            const middleware = route.middlewares?.map((m: IMiddleware) => m.execute.bind(m))|| [];
            const handler = route.func.bind(this);
            const pipeline = middleware ? [...middleware, handler] : handler;

            // @ts-ignore
            this.router[route.method](route.path, pipeline);
        }
    }
}