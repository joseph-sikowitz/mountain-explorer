import "dotenv/config";
import { MongoClient } from "mongodb";

// The MongoDB connection is opened once and reused across the application.
const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGODB_NAME);
  }
  return db;
}

export async function getCollection(collectionName) {
  const database = await connect();
  return database.collection(collectionName);
}

export async function queryCollection(collectionName, query) {
  const collection = await getCollection(collectionName);
  return collection.findOne(query);
}
