// plugins/firebase-client.ts
import { initializeApp, getApps as getFirebaseApps } from "firebase/app";

export default defineNuxtPlugin(() => {
	const firebaseConfig = {
		apiKey: process.env.FIREBASE_API_KEY,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN,
		projectId: process.env.FIREBASE_PROJECT_ID,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.FIREBASE_APP_ID,
	};

	// Ensure Firebase app is initialized only once
	if (!getApps().length) {
		initializeApp(firebaseConfig);
	}
});
function getApps() {
	return getFirebaseApps();
}
