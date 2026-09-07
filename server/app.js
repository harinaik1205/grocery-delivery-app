import "dotenv/config";
import { connectDB } from "./src/config/connect.js";
import fastify from "fastify";
import { PORT } from "./src/config/config.js";
import fastifySocketIO from "@wick_studio/fastify-socket.io";
import { registerRoutes } from "./src/routes/index.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { initializeFirebaseApp } from "./src/config/firebase.js";

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    const app = fastify();
    const firebaseApp = initializeFirebaseApp();

    app.register(fastifySocketIO, {
      cors: {
        origin: "*",
      },
      pingInterval: 10000,
      pingTimeout: 5000,
      transports: ["websocket"],
    });

    await registerRoutes(app);

    await buildAdminRouter(app);

    app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
      if (err) {
        console.log(err);
      } else {
        console.log(
          `Grocery App running on http://localhost:${PORT}${admin.options.rootPath}`,
        );
      }
    });

    app.ready().then(() => {
      app.io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("joinRoom", (orderId) => {
          socket.join(orderId);
          console.log(`user joined room ${orderId}`);
        });

        socket.on("disconnect", () => {
          console.log("User disconnected");
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

start();
