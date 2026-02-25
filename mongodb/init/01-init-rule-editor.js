const dbName = process.env.MONGO_INITDB_DATABASE || "rule_editor";
const appUser = process.env.APP_DB_USER || "rule_editor_app";
const appPassword = process.env.APP_DB_PASSWORD;

if (!appPassword) {
  throw new Error("APP_DB_PASSWORD is required for initialization");
}

const validator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["task_id", "metadata", "flint_spec", "saved_artifact", "eflint"],
    properties: {
      task_id: {
        bsonType: "string",
        description: "Stable application-level identifier for the task/document"
      },
      metadata: {
        bsonType: "object",
        required: ["owner", "owner_group", "created_at", "modified_at"],
        properties: {
          owner: { bsonType: "string" },
          owner_group: { bsonType: "string" },
          created_at: { bsonType: "date" },
          modified_at: { bsonType: "date" },
          title: { bsonType: "string" },
          description: { bsonType: "string" },
          tags: {
            bsonType: "array",
            items: { bsonType: "string" }
          }
        }
      },
      flint_spec: {
        bsonType: ["object", "string"],
        description: "Original FLINT specification payload"
      },
      saved_artifact: {
        bsonType: "object",
        required: ["format", "content"],
        properties: {
          format: { enum: ["application/json"] },
          content: {
            bsonType: "string",
            description: "Generated artifact content saved by export"
          }
        }
      },
      eflint: {
        bsonType: "object",
        required: ["specification", "scenario", "generated_at"],
        properties: {
          specification: {
            bsonType: "string",
            description: "Generated eFLINT specification"
          },
          scenario: {
            bsonType: "string",
            description: "Generated eFLINT scenario"
          },
          generated_at: { bsonType: "date" },
          generator_version: { bsonType: "string" }
        }
      }
    }
  }
};

const adminDb = db.getSiblingDB("admin");
const targetDb = db.getSiblingDB(dbName);

const existingUser = targetDb.getUser(appUser);
if (!existingUser) {
  targetDb.createUser({
    user: appUser,
    pwd: appPassword,
    roles: [{ role: "readWrite", db: dbName }]
  });
}

const existingCollection = targetDb.getCollectionInfos({ name: "task_collection" });
if (existingCollection.length === 0) {
  targetDb.createCollection("task_collection", {
    validator,
    validationLevel: "strict",
    validationAction: "error"
  });
} else {
  targetDb.runCommand({
    collMod: "task_collection",
    validator,
    validationLevel: "strict",
    validationAction: "error"
  });
}

targetDb.task_collection.createIndex({ task_id: 1 }, { unique: true });
targetDb.task_collection.createIndex({ "metadata.owner": 1 });
targetDb.task_collection.createIndex({ "metadata.owner_group": 1 });
targetDb.task_collection.createIndex({ "metadata.modified_at": -1 });

print(`Initialized MongoDB database '${dbName}' with task_collection schema and indexes.`);
