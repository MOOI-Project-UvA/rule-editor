// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2
import SuperAgent from "superagent";

const allowedDomains = [process.env.ALLOWED_DOMAINS];
console.log("allowedDomains:", allowedDomains);

export const handler = async function (event, context) {
  const origin = event.headers["origin"];
  console.log("origin:", origin);

  if (!allowedDomains.includes(origin)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Forbidden" }),
    };
  }

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

  console.log("source list", reply.body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Sources retrieved!",
      sources: reply.body,
    }),
  };
};

export const config = {
  rateLimit: {
    windowLimit: 1,
    aggregateBy: ["ip", "domain"],
  },
};
