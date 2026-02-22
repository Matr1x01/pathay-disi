// prisma.config.ts   ← place this file at the same level as package.json

import 'dotenv/config'; // loads your .env file
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma', // or wherever your schema is

  migrations: {
    path: 'prisma/migrations', // default, but good to be explicit
    // seed: "ts-node prisma/seed.ts",   // add later if you have a seed script
  },

  datasource: {
    url: env('DATABASE_URL'), // pulls from .env
    // shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),  // only if you use shadow db for migrations
  },
});
