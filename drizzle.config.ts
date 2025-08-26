import { type Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "./sqlite.db",
  },
  tablesFilter: ["melimou_*"],
} satisfies Config;
