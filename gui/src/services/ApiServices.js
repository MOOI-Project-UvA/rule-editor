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

export async function sendDataToTriply(dataset) {
  try {
    const response = await fetch(
      "http://localhost:5011/process_and_send",
      // "/api/wrap/process_and_send",

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: dataset,
      },
    );
    console.log("response:", response);
    if (!response.ok) {
      throw new Error("An error occurred during sending the data.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      "An error occurred while saving the data request: " + error.message,
    );
    return error;
  }
}

export async function retrieveAvailableGraphs() {
  try {
    const response = await fetch(
      "http://localhost:5012/get_graph_names",
      // "/api/wrap/process_and_send",

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
      },
    );

    const data = await response.json();
    const options = [];
    console.log("data", data);
    data.forEach((graph) => {
      const graphNameParts = graph.graphName.split("/");
      const shortName = graphNameParts[graphNameParts.length - 1]; // only last part IRI

      options.push({ label: shortName, value: graph.graphName });

      // const option = document.createElement("option");
      // option.value = graph.graphName;
      // option.textContent = shortName;
      // selectElement.appendChild(option);
    });
    return options;
  } catch (error) {
    throw new Error(
      "An error occurred while trying to retrieve the available graphs: " +
        error.message,
    );
    return error;
  }
}

export async function retrieveSelectedGraph(graphData) {
  console.log("graphData:", graphData);
  try {
    const response = await fetch(
      "http://localhost:5012/process_and_download_graph/" + graphData,
      // "/api/wrap/process_and_send",

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
      },
    );

    if (!response.ok) {
      throw new Error("An error occurred during sending the data.");
    }

    return response.json();
  } catch (error) {
    throw new Error(
      "An error occurred while saving the data request: " + error.message,
    );
    return error;
  }
}
