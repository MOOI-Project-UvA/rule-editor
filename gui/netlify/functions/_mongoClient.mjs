import { MongoClient } from "mongodb";

let cachedClient = null;

export async function getMongoCollection() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "rule_editor";
  const collectionName = process.env.MONGODB_COLLECTION_NAME || "task_collection";

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });

    try {
      await cachedClient.connect();
      await cachedClient.db(dbName).command({ ping: 1 });
    } catch (error) {
      cachedClient = null;
      throw new Error(`Mongo connection failed: ${error.message}`);
    }
  }

  return cachedClient.db(dbName).collection(collectionName);
}

export function parseDateField(value) {
  if (!value) return null;
  if (value.$date) return new Date(value.$date);
  if (typeof value === "string") return new Date(value);
  if (value instanceof Date) return value;
  return null;
}
