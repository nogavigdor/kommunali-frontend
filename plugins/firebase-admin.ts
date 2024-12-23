// Firebase Admin Initialization
// This plugin sets up the Firebase Admin SDK using the credentials from runtimeConfig.
// It's only initialized once (to avoid duplicate initialization errors).
// Mainly for server-side stuff like handling user tokens, Firestore, or anything that
// requires admin privileges. This runs on the server side with Nuxt.

import * as admin from "firebase-admin";
import { defineEventHandler } from "h3";

export default defineEventHandler(() => {
	const runtimeConfig = useRuntimeConfig();

	// Initialize the Firebase Admin SDK only if it hasn't been initialized already
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: runtimeConfig.firebaseAdmin.projectId,
				privateKey: runtimeConfig.firebaseAdmin.privateKey,
				clientEmail: runtimeConfig.firebaseAdmin.clientEmail,
			}),
		});
	}
});
