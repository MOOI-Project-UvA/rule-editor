import {
  buildOwnerScopedQuery,
  getMongoCollection,
  parseDateField,
  resolveRequestUsername,
} from "../_mongoClient.mjs";

export const handler = async function (event) {
  try {
    const data = JSON.parse(event.body || "{}");
    const task = data.task;
    const username = resolveRequestUsername(event, data);

    if (!username) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Missing username context" }),
      };
    }

    if (!task) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required task payload" }),
      };
    }

    const now = new Date();
    const projectId = task.project_id || task.task_id || task?.flint_spec?.id || crypto.randomUUID();

    const collection = await getMongoCollection();
    const projectOwnerQuery = buildOwnerScopedQuery(username, { project_id: projectId });
    const latestVersion = await collection.findOne(
      projectOwnerQuery,
      { sort: { project_version: -1 } },
    );

    const nextVersion = (latestVersion?.project_version || 0) + 1;
    const snapshotTaskId = `${username}:${projectId}:v${nextVersion}`;

    const createdAt =
      latestVersion?.metadata?.created_at || parseDateField(task?.metadata?.created_at) || now;
    const modifiedAt = now;
    const generatedAt = parseDateField(task?.eflint?.generated_at) || now;
    const ownerGroup = task?.metadata?.owner_group || "";

    const document = {
      ...task,
      owner_username: username,
      project_id: projectId,
      project_version: nextVersion,
      task_id: snapshotTaskId,
      metadata: {
        ...(task.metadata || {}),
        owner: username,
        owner_group: ownerGroup,
        created_at: createdAt,
        modified_at: modifiedAt,
      },
      eflint: {
        ...(task.eflint || {}),
        generated_at: generatedAt,
      },
    };

    await collection.insertOne(document);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Task version saved to MongoDB!",
        owner_username: username,
        project_id: projectId,
        project_version: nextVersion,
        task_id: snapshotTaskId,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `MongoDB save failed: ${error.message}` }),
    };
  }
};
