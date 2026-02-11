// /.netlify/functions/generate-eflint
// Proxies interpretation JSON to ${FLINT_TRANSLATION_URL}/generate-eflint

export async function handler(event) {
  const baseUrl =
    process.env.FLINT_TRANSLATION_URL ||
    process.env.PY_SERVICE_URL ||
    "http://localhost:8000";
  // console.log("Base URL:",baseUrl);

  // console.log("Received event:", event);

  const body = JSON.parse(event.body);

  // console.log(`${baseUrl.replace(/\/+$/, "")}/generate-eflint`);

  const resp = await fetch(`${baseUrl.replace(/\/+$/, "")}/generate-eflint`, {
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
