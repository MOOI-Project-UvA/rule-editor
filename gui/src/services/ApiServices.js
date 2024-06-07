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
    const response = await fetch(
      "http://localhost:5000/process_and_save",
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

    if (!response.ok) {
      throw new Error("An error occurred during sending the data.");
    }

    const data = await response.text();
    console.log("response:", data);
    return data;
  } catch (error) {
    throw new Error(
      "An error occurred while converting data to rdf: " + error.message,
    );
    return error;
  }
}


