# Express.js with TypeScript: A Comprehensive Guide


This guide walks you through setting up an Express.js application using TypeScript, covering initial setup, creating routes with examples, and incorporating testing.

## 1. Project Setup and Configuration

### Project Initialization

Start by initializing a new Node.js project:

```bash
npm init -y
```

This creates a `package.json` file to manage project dependencies.

### Installing Dependencies

Install the core dependencies:

```bash
# Core Express framework
npm install express

# Development dependencies
npm install --save-dev typescript
npm install --save-dev @types/express
npm install --save-dev ts-node
npm install --save-dev nodemon
npm install --save-dev cors
npm install --save-dev @types/cors
npm install --save-dev dotenv
```

**Dependencies Explained:**
- `express`: The Express.js framework
- `typescript`: TypeScript compiler and language support
- `@types/express`: TypeScript definitions for Express (provides type information)
- `ts-node-dev`: Tool for running TypeScript files directly during development with auto-restart

### Optional Dependencies
```bash
npm install cookie-parser
npm i --save-dev @types/cookie-parser
```

### TypeScript Configuration

Generate the TypeScript configuration file:

```bash
npx tsc --init
```

Configure your `tsconfig.json` with these key settings:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "noImplicitAny": true, 
    "strictNullChecks": true, 
    "strictFunctionTypes": true
  }
}
```

**Configuration Explained:**
- `"target": "es2016"`: JavaScript version to compile to
- `"module": "commonjs"`: Module system (compatible with Node.js)
- `"outDir": "./dist"`: Output directory for compiled JavaScript
- `"rootDir": "./src"`: Root directory for TypeScript source files


### package.json update
```json
{
  "type": "commonjs",
  "scripts": {
		"build": "tsc --build",
		"start": "node ./dist/index.js",
		"dev": "nodemon ./src/index.ts"
	},
  
}
```

## 2. Project Structure & Initial Setup

### Directory Structure

```
my-express-app/
  ├── dist/          (created by compiler)
  ├── public/       (if you need to store files temporarily)
  │   └── temp/
  │       └── .gitkeep
  ├── src/
  │   └── controllers/
  │       └── user.controller.ts
  │   └── db/
  │       └── index.ts
  │   └── middlewares/
  │       └── auth.middleware.ts
  │   └── models/
  │       └── user.model.ts
  │   └── routes/
  │       └── user.route.ts
  │   └── utils/
  │       └── apiError.ts
  │       └── apiResponse.ts
  │       └── asyncHandler.ts
  │   └── types/
  │       └── reqBody.ts
  │       └── reqQuery.ts
  │       └── reqParams.ts
  │       └── resBody.ts
  │   └── app.ts
  │   └── index.ts
  ├── .env
  ├── package.json
  └── tsconfig.json
  └── .gitignore
```

### src/app.ts

```typescript
import express from "express";
import cors from "cors";
//import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//app.use(express.static("public"));
//app.use(cookieParser());

//routes import
import userRouter from "./routes/user.route";

//rotes use
app.use("/api/v1/users", userRouter);

export { app };
```

### src/index.ts

```typescript
import dotenv from "dotenv"
dotenv.config({
    path: './.env',
})

import connectDB from "./db/index"
import { app } from "./app"


connectDB()
.then(() => {

    app.on("error", (err) => {
        throw err
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server: http://localhost:${process.env.PORT}`);
    })

})
.catch((err: Error) => {
    console.log("ERR: ", err);
    process.exit(1);
})
```

### .env

```typescript
CORS_ORIGIN="*"
```

### src/routes/user.route.ts

```typescript
import { Router } from "express";
import { getUsers, getUserById, createUser } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);

export default router;
```


### src/controllers/user.controller.ts

```typescript
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
```

### src/db/index.ts

```typescript
const connectDB = async () => {

}

export default connectDB;
```

### src/utils/apiError.ts

```typescript
class ApiError extends Error {
    public readonly statusCode: number;
    public readonly success: boolean = false;

    constructor(statusCode: number,
                message: string = "Something went wrong",
                stack: string = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message

        if(stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export { ApiError }
```
### src/utils/apiResponse.ts

```typescript
class ApiResponse<T = object> {
    public readonly statusCode: number
    public readonly data: T
    public readonly message: string
    public readonly success: boolean
    constructor(statusCode: number, data: T, message: string = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }
```

### src/utils/asyncHandler.ts

```typescript
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

```

### src/types/reqBody.ts

```typescript
export interface CreateUserReqBody {
	username: string;
	email: string;
	password: string;
}
```

### src/types/reqQuery.ts

```typescript
export interface createUserReqQuery {
  loginAfterCreate?: boolean;
}
```

### src/types/reqParams.ts

```typescript
export interface getUserByIdReqParams {
  id: number;
}
```

### src/types/resBody.ts

```typescript
export interface createUserResBody {
  id: number;
  email: string;
  username: string;
}
```

## 3. Git/Github Setup

### Git init
```bash
git init
```

### src/.gitignore

```typescript
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

```


### Connect to Github