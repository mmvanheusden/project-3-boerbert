import 'dotenv/config';
import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: [
      './src/activities/model.ts',
      './src/slideshow/model.ts',
      './src/slots/model.ts',
      './src/bookings/model.ts',
  ],
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  },
});