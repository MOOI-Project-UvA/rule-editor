// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2
import SuperAgent from "superagent";

// const rateLimit = {}; // In-memory store (resets on function restart)
// const MAX_REQUESTS = 1; // Max requests allowed
// const TIME_WINDOW = 60 * 1000; // 60 seconds (1 min)

export const handler = async function (event, context) {
  console.log("sources: ", event.headers);

  // check api key
  const apiKey = event.headers["x-edge-message"];
  const secretKey = process.env.X_API_KEY;
  console.log("api key in getAvailableSources:", apiKey);

  if (!apiKey || apiKey !== secretKey) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized: Invalid key" }),
    };
  }

  // // check origin of request
  // const referer = event.headers.referer || "";
  // console.log("referer:", referer);
  //
  // if (!referer.includes(allowedDomains)) {
  //   return {
  //     statusCode: 403,
  //     body: JSON.stringify({ error: "Access denied!" }),
  //   };
  // }
  //
  // const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
  // const currentTime = Date.now();
  // if (!rateLimit[ip]) {
  //       rateLimit[ip] = { count: 1, startTime: currentTime };
  //   } else {
  //       rateLimit[ip].count++;
  //
  //       // Reset count if time window has passed
  //       if (currentTime - rateLimit[ip].startTime > TIME_WINDOW) {
  //           rateLimit[ip] = { count: 1, startTime: currentTime };
  //       }
  //   }
  //
  //   // If limit exceeded, return 429 error
  //   if (rateLimit[ip].count > MAX_REQUESTS) {
  //       return {
  //           statusCode: 429,
  //           body: JSON.stringify({ error: "Too many requests. Try again later." }),
  //
  //       };
  // }

  const token = process.env.TRIPLY_KEY;
  const endpoint = process.env.TRIPLY_ENDPOINT;
  const reply = await SuperAgent.post(endpoint)
    .set("Accept", "application/sparql-results+json")
    .set("Authorization", "Bearer " + token)
    .buffer(true)
    .send({
      query: `
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX src: <http://ontology.tno.nl/normengineering/source#>
      SELECT DISTINCT ?iri ?title ?date ?editor WHERE {
        ?iri a src:Source .
        ?iri src:hasTitle ?title .
        ?iri src:editedBy ?editoriri .
        ?event src:generates ?iri ;
          src:ends ?date .
        ?editoriri rdfs:label ?editor .
      } ORDER BY DESC(?date)
      `,
    })
    .accept("json");

  console.log("source list", reply.body[0]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Sources retrieved!",
      sources: reply.body,
    }),
  };
};
