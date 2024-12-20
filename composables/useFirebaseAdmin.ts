import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Load service account credentials
import serviceAccount from "@/firebase-adminsdk.json";

// Initialize Admin SDK only once
if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
	});
}

// Export Firestore instance
export const db = getFirestore();
export const auth = admin.auth();
