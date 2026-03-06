import {
  buildOwnerScopedQuery,
  getMongoCollection,
  resolveRequestUsername,
} from "../_mongoClient.mjs";

export const handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const username = resolveRequestUsername(event, body);
    const projectId = body.project_id;

    if (!username) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Missing username context" }),
      };
    }

    if (!projectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing project_id" }),
      };
    }

    const collection = await getMongoCollection();
    const query = buildOwnerScopedQuery(username, { project_id: projectId });
    const versions = await collection.find(
      query,
      {
        projection: {
          _id: 0,
          owner_username: 1,
          project_id: 1,
          project_version: 1,
          task_id: 1,
          "metadata.title": 1,
          "metadata.owner": 1,
          "metadata.modified_at": 1,
        },
      },
    ).sort({ project_version: -1 }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Project versions retrieved!", versions }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `MongoDB version list failed: ${error.message}` }),
    };
  }
};
