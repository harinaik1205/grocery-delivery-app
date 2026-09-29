import "dotenv/config";
import fastify from "fastify";

import { connectDB } from "../src/config/connect.js";
import { registerRoutes } from "../src/routes/index.js";
import { buildAdminRouter } from "../src/config/setup.js";
import { initializeFirebaseApp } from "../src/config/firebase.js";
import { assetLinks } from "../src/config/assetsLink.js";

const app = fastify({
  logger: true,
});

let initialized = false;

async function initialize() {
  if (initialized) return;

  await connectDB(process.env.MONGODB_URI);

  initializeFirebaseApp();

  await registerRoutes(app);

  app.get("/.well-known/assetlinks.json", async (request, reply) => {
    return reply.type("application/json").send(assetLinks);
  });

  app.get("/", async () => {
    return "Welcome To LocalMart";
  });

  await buildAdminRouter(app);

  await app.ready();

  initialized = true;
}

export default async function handler(req, res) {
  try {
    await initialize();

    app.server.emit("request", req, res);
  } catch (error) {
    console.error("Fastify error:", error);

    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
