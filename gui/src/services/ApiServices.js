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
    return error;
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
  try {
    const response = await fetch("/api/wrapUp/process_graph", {
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