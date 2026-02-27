import {
  getMongoCollection,
  resolveRequestUsername,
} from "../_mongoClient.mjs";

export const handler = async function (event) {
  try {
    const username = resolveRequestUsername(event);

    if (!username) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Missing username context" }),
      };
    }

    const collection = await getMongoCollection();

    const projects = await collection.aggregate([
      {
        $match: {
          $or: [
            { owner_username: username },
            {
              owner_username: { $exists: false },
              "metadata.owner": username,
            },
          ],
        },
      },
      { $sort: { project_id: 1, project_version: -1 } },
      {
        $group: {
          _id: "$project_id",
          latest: { $first: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          project_id: "$_id",
          latest_version: "$latest.project_version",
          task_id: "$latest.task_id",
          title: "$latest.metadata.title",
          owner: "$latest.metadata.owner",
          owner_group: "$latest.metadata.owner_group",
          owner_username: "$latest.owner_username",
          modified_at: "$latest.metadata.modified_at",
        },
      },
      { $sort: { modified_at: -1 } },
    ]).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Projects retrieved!", projects }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `MongoDB project list failed: ${error.message}` }),
    };
  }
};
