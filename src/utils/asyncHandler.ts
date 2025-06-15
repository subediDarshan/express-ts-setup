import { Request, Response, NextFunction, RequestHandler, ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

type AsyncRequestHandler<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs> = (
    req: Request<P, any, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
) => Promise<void | Response>;

const asyncHandler = <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(
    requestHandler: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>
): RequestHandler<P, any, ReqBody, ReqQuery> => {
    return (req: Request<P, any, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler };