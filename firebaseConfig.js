import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import {initializeAuth, getReactNativePersistence} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrmhUr2kWO2T5LasIvQM2wEw8_o2K2ZrI",
  authDomain: "fintech-b3101.firebaseapp.com",
  projectId: "fintech-b3101",
  storageBucket: "fintech-b3101.firebasestorage.app",
  messagingSenderId: "436146249725",
  appId: "1:436146249725:web:ba60c886efa29dd72b4394"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);

export default app 















