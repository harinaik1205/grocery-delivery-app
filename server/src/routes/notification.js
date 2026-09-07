import { triggerNotification } from "../controllers/notification/notification.js";
import { verifyToken } from "../middleware/auth.js";

export const notificationRoutes = async (fastify, options) => {
  fastify.addHook("preHandler", async (req, reply) => {
    const isAuthenticated = await verifyToken(req, reply);
    if (!isAuthenticated) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
  });

  fastify.get("/send-notification", triggerNotification);
};
