import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/app";
import { connectDB } from "../src/config/db";

// A serverless instance is reused across invocations, so the Mongo connection
// is established once per instance and shared by every request it handles.
let connection: Promise<void> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!connection) {
    connection = connectDB().catch((err) => {
      connection = null;
      throw err;
    });
  }
  await connection;
  return app(req as never, res as never);
}
