-- Create the database
CREATE DATABASE melimou;

-- Create user if doesn't exist and set password
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
      CREATE USER postgres WITH PASSWORD 'password';
   ELSE
      ALTER USER postgres WITH PASSWORD 'password';
   END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE melimou TO postgres;
ALTER USER postgres CREATEDB;
