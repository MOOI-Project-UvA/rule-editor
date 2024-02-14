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
