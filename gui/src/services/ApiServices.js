import SuperAgent from "superagent";
import { alertWidget } from "../helpers/alertWidget.js";
import { reformatDate } from "../helpers/dateTimeFunctions.js";

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
export async function convertToRDF(dataset, showWidget = true) {
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
    if (showWidget) {
      alertWidget("success", "Successful conversion to RDF!");
    }

    return data;
  } catch (error) {
    if (showWidget) {
      alertWidget(
        "error",
        "An error occured while converting data to rdf! Details:" +
          error.message,
      );
    }

    throw new Error(
      "An error occurred while converting data to rdf: " + error.message,
    );
  }
}

/*
  Converts RDF text to json structure as used by the editor
 */
export async function convertRDFToJSON(rdfString, json = false) {
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

    return !json ? await response.text() : await response.json();
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
  const sources = await fetch("/api/getSources", {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
  return sources.sources;
}

//retrieves source from Triply, specified by iri
export async function getSourceFromTriply(iri) {
  const response = await fetch("/api/getSource", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ iri: iri }),
  });

  // Retrieve the text content of the Turtle file
  const ttlContent = await response.json();
  // convert the graph to JSONLD via the unwrap-api
  const jsonSource = await convertRDFToJSON(ttlContent.source, true);
  return jsonSource;
}

export async function getTasksFromTriply() {
  const tasks = await fetch("/api/getAvailableTasks").then((response) =>
    response.json(),
  );
  tasks.tasks.forEach((r) => (r.date = reformatDate(r.date)));
  return tasks.tasks;
}

export async function getTaskFromTriply(iri) {
  console.log("iri:", iri);
  const task = await fetch("/api/getTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ iri: iri }),
  }).then((response) => response.json());
  // chech how to avoid double conversion between json to stringify to json

  return task;
}

export async function saveTaskAtTriply(taskInRdf) {
  const resp = await fetch("/api/saveTaskAtTriply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task: taskInRdf }),
  }).then((t) => {
    return { status: t.status, text: t.statusText };
  });

  if (resp.status === 200) {
    alertWidget("success", "The task has been saved successfully!");
  } else {
    alertWidget("error", resp.text);
  }
}
