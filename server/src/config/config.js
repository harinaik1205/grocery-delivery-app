import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/index.js";

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

sessionStore.on("error", (error) => {
  console.log("Session store error", error);
});

const DEFAULT_ADMIN = {
  email: "hari@gmail.com",
  password: "hari247",
};

export const authenticate = async (email, password) => {
  if (email && password) {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      return Promise.resolve(DEFAULT_ADMIN);
    } else {
      return null;
    }
  }

  //UNCOMMET THIS WHEN ADMIN CREATED MANUALLY
  // if (email && password) {
  //   const user = await Admin.findOne({ email });
  //   if (!user) {
  //     return null;
  //   }
  //   if (user.password === password) {
  //     return Promise.resolve({ email, password });
  //   } else {
  //     return null;
  //   }
  // }

  return null;
};
