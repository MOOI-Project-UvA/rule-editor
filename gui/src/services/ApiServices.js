import SuperAgent from "superagent";
// import { App } from "@triply/triplydb"; //TODO: gives error, not compatible with vite
import { alertWidget } from "../helpers/alertWidget.js";

export async function fetchNlpPrediction(text) {
  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify({ text }),
    });
    console.log("response:", response);
    if (!response.ok) {
      throw new Error("An error occurred during the prediction request.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      "An error occurred during the prediction request: " + error.message,
    );
  }
}

/*
  Converts the JSON structure supported by the editor to RDF
 */
export async function convertToRDF(dataset) {
  try {
    const response = await fetch("/api/wrapUp/process_and_save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: dataset,
    });

    if (!response.ok) {
      throw new Error("An error occurred while sending the data.");
    }

    const data = await response.text();
    alertWidget("success", "Successful conversion to RDF!");

    return data;
  } catch (error) {
    alertWidget(
      "error",
      "An error occured while converting data to rdf! Details:" + error.message,
    );
    throw new Error(
      "An error occurred while converting data to rdf: " + error.message,
    );
  }
}

/*
  Converts RDF text to json structure as used by the editor
 */
export async function convertRDFToJSON(rdfString) {
  console.log("rdfString", rdfString);
  try {
    const response = await fetch("/api/unwrap/process_graph", {
      method: "POST",
      headers: {
        "Content-Type": "text/turtle",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: rdfString,
    });

    if (!response.ok) {
      throw new Error("An error occurred while sending the data.");
    }

    const data = await response.text();
    console.log("data", data);
    return data;
  } catch (error) {
    alertWidget(
      "error",
      "An error occured while converting data to rdf! Details:" + error.message,
    );
    throw new Error(
      "An error occurred while converting data to rdf: " + error.message,
    );
  }
}

export async function getSourceList() {
  const token = import.meta.env.VITE_TRIPLY_KEY;

  const reply = await SuperAgent.post(
    "https://api.normativesystems.triply.cc/datasets/choppr/chopprdev/sparql",
  )
    .set("Accept", "application/sparql-results+json")
    .set("Authorization", "Bearer " + token)
    .buffer(true)
    .send({
      query: `
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX src: <http://ontology.tno.nl/normengineering/source#>
      SELECT  ?iri ?title ?date ?editor WHERE {
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
  return reply.body;
}

//retrieves source from Triply, specified by iri
export async function getSourceFromTriply(iri) {
  const response = await fetch("/.netlify/functions/getSourceFromTriply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ iri: iri }),
  }).then((response) => response.json());
  console.log("response:", response);

  const jsonSource = await convertRDFToJSON(response.source);
  console.log("jsonSource: ", jsonSource);
  // TODO: The graph has to be converted to JSON via the unwrap-api. Does the API support a source?
  return jsonSource;
}
