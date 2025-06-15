import { NextFunction, Request, Response } from "express-serve-static-core";
import { createUserReqBody } from "../types/reqBody";
import { createUserReqQuery } from "../types/reqQuery";
import { createUserResBody } from "../types/resBody";
import { getUserByIdReqParams } from "../types/reqParams";
import { asyncHandler } from "../utils/asyncHandler";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
	res.send([]);
})

export const getUserById = asyncHandler(async (req: Request<getUserByIdReqParams>, res:Response) => {
	return res.send({})
})

export const createUser = asyncHandler(async (
	req: Request<{}, {}, createUserReqBody, createUserReqQuery>,
	res: Response<createUserResBody>,
	next: NextFunction
) => {
	return res.status(201).send({
		id: 1,
		username: "anson",
		email: "anson@ansonthedev.com",
	});
})

export const loginUser = asyncHandler(async (req, res, next) => {

})