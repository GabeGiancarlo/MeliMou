#!/bin/bash

echo "🍯 PostgreSQL Setup for MeliMou (Optional)"
echo "========================================"
echo ""
echo "You have two options:"
echo ""
echo "1. 📱 Keep SQLite (Easier for development)"
echo "   - Current setup works perfectly"
echo "   - Use Postico with 'New Server' → 'SQLite'"
echo "   - File path: $(pwd)/sqlite.db"
echo ""
echo "2. 🐘 Switch to PostgreSQL (Better for production)"
echo "   - More powerful database"
echo "   - Better Postico integration"
echo "   - Requires PostgreSQL installation"
echo ""

read -p "Do you want to switch to PostgreSQL? (y/N): " switch_to_pg

if [[ $switch_to_pg =~ ^[Yy]$ ]]; then
    echo ""
    echo "🐘 Setting up PostgreSQL..."
    
    # Check if PostgreSQL is installed
    if ! command -v psql &> /dev/null; then
        echo "📦 Installing PostgreSQL with Homebrew..."
        brew install postgresql@15
        brew services start postgresql@15
    else
        echo "✅ PostgreSQL is already installed"
    fi
    
    # Create database
    echo "🗄️ Creating MeliMou database..."
    createdb melimou_dev 2>/dev/null || echo "Database may already exist"
    
    # Update environment variables
    echo "🔧 Updating environment variables..."
    sed -i '' 's|DATABASE_URL="file:./sqlite.db"|DATABASE_URL="postgresql://localhost:5432/melimou_dev"|g' .env.local
    
    # Update drizzle config
    echo "⚙️ Updating Drizzle configuration..."
    cat > drizzle.config.ts << 'EOF'
import { type Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://localhost:5432/melimou_dev",
  },
  tablesFilter: ["melimou_*"],
} satisfies Config;
EOF

    # Install PostgreSQL driver
    echo "📦 Installing PostgreSQL driver..."
    npm install pg @types/pg
    npm uninstall better-sqlite3 @types/better-sqlite3
    
    # Update database connection
    echo "🔌 Updating database connection..."
    cat > src/server/db/index.ts << 'EOF'
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn =
  globalForDb.conn ??
  postgres(env.DATABASE_URL, {
    max: env.NODE_ENV === "production" ? 10 : 1,
  });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
EOF

    # Update schema to use PostgreSQL types
    echo "📝 Updating schema for PostgreSQL..."
    sed -i '' 's/import { sqliteTableCreator }/import { pgTableCreator }/g' src/server/db/schema.ts
    sed -i '' 's/} from "drizzle-orm\/sqlite-core";/} from "drizzle-orm\/pg-core";/g' src/server/db/schema.ts
    sed -i '' 's/export const createTable = sqliteTableCreator/export const createTable = pgTableCreator/g' src/server/db/schema.ts
    
    echo ""
    echo "✅ PostgreSQL setup complete!"
    echo ""
    echo "🔄 Next steps:"
    echo "1. Run: npm run db:generate"
    echo "2. Run: npm run db:migrate"
    echo "3. Run: npx tsx scripts/create-admin.ts"
    echo "4. In Postico: postgresql://localhost:5432/melimou_dev"
    echo ""
else
    echo ""
    echo "📱 Keeping SQLite setup"
    echo ""
    echo "🔧 To connect with Postico:"
    echo "1. Open Postico"
    echo "2. Click 'New Server' (not URL)"
    echo "3. Select 'SQLite'"
    echo "4. Browse to: $(pwd)/sqlite.db"
    echo ""
fi 