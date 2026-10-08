import "dotenv/config";
import { MongoClient } from "mongodb";

// The MongoDB connection is cached and reused across the application.
const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGODB_NAME);
  }
  return db;
}

async function getCollection(collectionName) {
  const database = await connect();
  return database.collection(collectionName);
}

export async function queryCollection(collectionName, query = {}, limit = 10) {
  const collection = await getCollection(collectionName);
  try {
    return await collection.find(query).limit(limit).toArray();
  } catch (error) {
    console.error("Error querying collection:", error);
    throw error;
  }
}
