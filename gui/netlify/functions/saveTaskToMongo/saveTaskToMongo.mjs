import { getMongoCollection, parseDateField } from "../_mongoClient.mjs";

export const handler = async function (event) {
  try {
    const data = JSON.parse(event.body || "{}");
    const task = data.task;

    if (!task) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required task payload" }),
      };
    }

    const now = new Date();
    const projectId = task.project_id || task.task_id || task?.flint_spec?.id || crypto.randomUUID();

    const collection = await getMongoCollection();
    const latestVersion = await collection.findOne(
      { project_id: projectId },
      { sort: { project_version: -1 } },
    );

    const nextVersion = (latestVersion?.project_version || 0) + 1;
    const snapshotTaskId = `${projectId}:v${nextVersion}`;

    const createdAt =
      latestVersion?.metadata?.created_at || parseDateField(task?.metadata?.created_at) || now;
    const modifiedAt = now;
    const generatedAt = parseDateField(task?.eflint?.generated_at) || now;

    const document = {
      ...task,
      project_id: projectId,
      project_version: nextVersion,
      task_id: snapshotTaskId,
      metadata: {
        ...(task.metadata || {}),
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
