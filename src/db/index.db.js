import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, get } from "firebase/database";
import { ApiError } from "../utils/ApiError.js";
import dotenv from 'dotenv';
dotenv.config();

// configs
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.measurementId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

// app initilize
const app = initializeApp(firebaseConfig);

// db initilize 
const db = getDatabase(app)

// databse storing Dealing with dups
const storeToDb = async (articles) => {
  try {
    const dbRef = ref(db, 'news/articles');
    
    const snapshot = await get(dbRef);
    const existing = snapshot.exists() ? snapshot.val() : {};
    
    const existingUrls = new Set(Object.values(existing).map(article => article.url));
    
    const newArticles = articles.filter(article => !existingUrls.has(article.url));

    for (const article of newArticles) {
      const articleRef = push(dbRef);
      await set(articleRef, {
        ...article,
        id: articleRef.key
      });
    }
    console.log("Data inserted in Db")
    console.log(newArticles.length+" new articles stored in Firebase!")

  } catch (error) {
    console.error("Firebase store error : ", error.message);
    throw new ApiError(500, "Database insertion failed", [error.message]);
  }
};

export { app, storeToDb };
