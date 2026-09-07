import { sendNotification } from "../../utils/helper.js";

export const triggerNotification = async (req, reply) => {
  const { userId } = req.user;
  const { message } = req.body;

  try {
    await sendNotification(userId, message);
    reply.status(200).send("Notification send successfully");
  } catch (error) {
    return reply.status(500).send("Internal Server Error");
  }
};
