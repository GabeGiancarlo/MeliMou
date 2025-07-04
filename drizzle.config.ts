import { type Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    database: "MeliMou",
    user: "gabegiancarlo",
    password: "GoalKeeper442*",
    ssl: false,
  },
  tablesFilter: ["melimou_*"],
} satisfies Config;
