// Firebase Web App configuration
// Safarnama Firebase Web App configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAf0bAhH_C_BkhsfAT4PJg1JMSqqR9kthY",
  authDomain: "safarnama-a32b8.firebaseapp.com",
  projectId: "safarnama-a32b8",
  storageBucket: "safarnama-a32b8.firebasestorage.app",
  messagingSenderId: "315632868328",
  appId: "1:315632868328:web:f8da738d057fac8df6625d",
  measurementId: "G-5KJGGY365S",
};

const REQUIRED_KEYS = ["apiKey", "authDomain", "projectId", "appId"];

export function hasFirebaseConfig() {
  return REQUIRED_KEYS.every((key) => {
    const value = (firebaseConfig[key] || "").trim();
    return value.length > 0 && !value.startsWith("PASTE_");
  });
}
