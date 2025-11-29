import {Elysia} from 'elysia'
import {node} from '@elysiajs/node'
import 'dotenv/config';
import {AppRoutes} from "./index.routes";
import openapi, {fromTypes} from "@elysiajs/openapi";
import { staticPlugin } from '@elysiajs/static'
import cors from "@elysiajs/cors";

const app = new Elysia({adapter: node()})
    .use(openapi({
        references: fromTypes()
    }))
	.use(staticPlugin())
    .use(cors())
    .use(AppRoutes)
	.get("/ping", () => "pong") // /ping geeft terug pong
    .listen(3000, ({hostname, port}) => {
        console.log(
            `🦊 Elysia is running at ${hostname}:${port}`
        )
    })

export type ElysiaApp = typeof app