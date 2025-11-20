import {Elysia} from 'elysia'
import {node} from '@elysiajs/node'
import 'dotenv/config';
import {AppRoutes} from "./index.routes";

const app = new Elysia({adapter: node()})
    .use(AppRoutes)
    .listen(3000, ({hostname, port}) => {
        console.log(
            `🦊 Elysia is running at ${hostname}:${port}`
        )
    })
