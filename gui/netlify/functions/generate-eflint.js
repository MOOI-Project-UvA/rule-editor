// /.netlify/functions/generate-eflint
// Proxies interpretation JSON to ${PY_SERVICE_URL}/generate

export async function handler(event) {
  const baseUrl = process.env.PY_SERVICE_URL;
  // console.log("Base URL:",baseUrl);

  // console.log("Received event:", event);

  const body = JSON.parse(event.body);

  // console.log(`${baseUrl.replace(/\/+$/, "")}/generate`);

  const resp = await fetch(`${baseUrl.replace(/\/+$/, "")}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interpretation: body.interpretation }),
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: await resp.text(),
  };
}
