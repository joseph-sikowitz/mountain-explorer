import dotenv from "dotenv";
import { MongoClient } from "mongodb";

export default function database() {
  const me = {};

  // Read environment variables
  dotenv.config({ quiet: true });

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

  // Get a collection in the database
  me.getCollection = async (collectionName) => {
    const database = await connect();
    return database.collection(collectionName);
  };

  // Get a subset of a collection with a query
  me.queryCollection = async (collectionName, query = {}, limit = 10) => {
    const collection = await me.getCollection(collectionName);
    try {
      return await collection.find(query).limit(limit).toArray();
    } catch (error) {
      console.error("Error querying collection:", error);
      throw error;
    }
  };

  // Disconnect database
  me.disconnect = async () => {
    await client.close();
  };

  // Return database object
  return me;
}
