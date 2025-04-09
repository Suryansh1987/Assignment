require("dotenv").config();

/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: "./drizzle/schema.js",  // 👉 Change this if your schema is in a different place
  out: "./drizzle",              // Where your migrations will go
  dialect: "postgresql",         // ✅ Correct field for Neon/Postgres
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_hISdKR7EQxN1@ep-aged-cherry-a5rdhh6z-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
  }
  ,
};
