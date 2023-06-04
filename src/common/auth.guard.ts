import {IMiddleware} from "./middleware.interface";
import {NextFunction, Request, Response} from "express";

export class AuthGuard implements IMiddleware {
    execute ({user}: Request, res: Response, next: NextFunction): void {
        if (user) {
            return next();
        }

        res.status(401).send({error: 'Unauthorized'});
    };
}