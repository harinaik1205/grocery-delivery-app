import { Customer, DeliveryPartner } from "../models/index.js";
import admin from "firebase-admin";

import { getMessaging } from "firebase-admin/messaging";

export const sendNotification = async (
  userId,
  userRole = "customer",
  message,
) => {
  let user;
  try {
    user =
      userRole === "customer"
        ? await Customer.findById(userId)
        : await DeliveryPartner.findById(userId);

    if (!user) {
      throw new Error(
        userRole === "customer"
          ? "User not found"
          : "Delivery Partner not found",
      );
    }

    const payload = {
      notification: {
        title: message.title,
        body: message?.body,
        image:
          "https://res.cloudinary.com/deyffbvwb/image/upload/v1788766061/appstore_igvjjb.jpg",
      },
      token: user.fcmToken,
    };

    // const response = await admin.messaging().send(payload);
    const response = await getMessaging().send(payload);
    console.log("Sucessfully sent message", response);
  } catch (error) {
    console.log("Error sending message:", error);
  }
};
