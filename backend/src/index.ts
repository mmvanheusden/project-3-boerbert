import {Elysia} from 'elysia'
import 'dotenv/config';
import {AppRoutes} from "./index.routes";
import openapi, {fromTypes} from "@elysiajs/openapi";
import { staticPlugin } from '@elysiajs/static'
import cors from "@elysiajs/cors";

const app = new Elysia()
    .use(openapi({
        references: fromTypes()
    }))
    .use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173"
    }))
	.use(staticPlugin())
    .use(AppRoutes)
	.get("/ping", () => "pong") // ping geeft terug pong
    .listen(3000, ({hostname, port}) => {
        console.log(
            `De backend runt op: ${hostname}:${port} !!!!`
        )
    })

export type ElysiaApp = typeof app