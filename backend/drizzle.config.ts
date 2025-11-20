import 'dotenv/config';
import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: [
      './src/activities/model.ts',
  ],
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});