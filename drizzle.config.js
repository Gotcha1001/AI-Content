/**@type {import("drizzle-kit").Config} */
export default {
  schema: "./app/utils/schema.tsx",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://jollysidecoder:57PvgHaMEmAe@ep-royal-morning-a5d1meug-pooler.us-east-2.aws.neon.tech/AI-Content-Generator?sslmode=require",
  },
};
