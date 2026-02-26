import { getMongoCollection } from "../_mongoClient.mjs";

export const handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const projectId = body.project_id;
    const projectVersion = body.project_version;

    if (!projectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing project_id" }),
      };
    }

    const collection = await getMongoCollection();

    const query =
      projectVersion != null
        ? { project_id: projectId, project_version: Number(projectVersion) }
        : { project_id: projectId };

    const options = projectVersion != null ? {} : { sort: { project_version: -1 } };
    const task = await collection.findOne(query, options);

    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Task retrieved!", task }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `MongoDB task retrieval failed: ${error.message}` }),
    };
  }
};
