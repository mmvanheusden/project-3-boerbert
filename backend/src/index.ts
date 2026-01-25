import {Elysia} from 'elysia'
import 'dotenv/config';
import {AppRoutes} from "./index.routes";
import openapi, {fromTypes} from "@elysiajs/openapi";
import { cron, Patterns } from '@elysiajs/cron'
import cors from "@elysiajs/cors";
import nodemailer from "nodemailer"
import { sendReminderEmails } from "./bookings/service";

/* Turns a "." into a "," (localization) */
declare global {
    interface String {
        dot2comma(): string;
    }
}
String.prototype.dot2comma = function() {
    return this.replace(".", ",");
};


const app = new Elysia()
    .use(openapi({
        references: fromTypes()
    }))
    .use(cors({
        origin: process.env.FRONTEND_URL || ""
    }))
    .use(cron({
        name: "reminder_email",
        pattern: Patterns.EVERY_30_MINUTES,
        async run() {
            await sendReminderEmails();
        }
    }))
    .use(AppRoutes)
	.get("/ping", () => "pong") // ping geeft terug pong
    .listen(3000, ({hostname, port}) => {
        console.log(
            `De backend runt op: ${hostname}:${port} !!!!`
        )
    })

export type ElysiaApp = typeof app

/* Mailtrap email configuratie */
export const EmailTransporter = nodemailer.createTransport(
    {
        host: 'live.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'api',
            pass: process.env.MAILTRAP_TOKEN!
        },
    },
    {
        from: {
            address: process.env.MAILTRAP_SENDER!,
            name: "Boerencamping De Groene Weide",
        }
    }
)