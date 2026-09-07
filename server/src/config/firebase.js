import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "../../serviceAccount.json")),
);

export const initializeFirebaseApp = () => {
  const app = admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    credential: cert(serviceAccount),
  });

  return app;
};
