import { MongoClient } from "mongodb";

let cachedClient = null;

function parseDateField(value) {
  if (!value) return null;
  if (value.$date) return new Date(value.$date);
  if (typeof value === "string") return new Date(value);
  return null;
}

async function getMongoCollection() {
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

export const handler = async function (event) {
  try {
    const data = JSON.parse(event.body || "{}");
    const task = data.task;

    if (!task || !task.task_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required task/task_id payload" }),
      };
    }

    const document = {
      ...task,
      metadata: {
        ...(task.metadata || {}),
        created_at: parseDateField(task?.metadata?.created_at),
        modified_at: parseDateField(task?.metadata?.modified_at),
      },
      eflint: {
        ...(task.eflint || {}),
        generated_at: parseDateField(task?.eflint?.generated_at),
      },
    };

    const collection = await getMongoCollection();
    await collection.updateOne(
      { task_id: document.task_id },
      { $set: document },
      { upsert: true },
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Task saved to MongoDB!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `MongoDB save failed: ${error.message}` }),
    };
  }
};
