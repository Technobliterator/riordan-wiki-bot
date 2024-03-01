import dotenv from "dotenv";

dotenv.config();

const { DATABASE_URL, DISCORD_TOKEN, DISCORD_CLIENT_ID, CHANNEL_ID } = process.env;

if (!DATABASE_URL || !DISCORD_TOKEN || !DISCORD_CLIENT_ID || !CHANNEL_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DATABASE_URL,
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  CHANNEL_ID
};