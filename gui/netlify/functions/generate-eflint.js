// /.netlify/functions/generate-eflint
// Proxies interpretation JSON to ${VITE_EFLINT_API_BASE_URL}/generate-eflint

import { buildGenerateEflintUrl } from "./eflintConfig.js";

export async function handler(event) {
  const url = buildGenerateEflintUrl();
  // console.log("Generate URL:", url);

  // console.log("Received event:", event);

  const body = JSON.parse(event.body);

  const resp = await fetch(url, {
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
