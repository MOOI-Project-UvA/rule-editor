import axios from "axios";

const apiClient = axios.create({
  mode: "no-cors",
  method: "post",
  crossDomain: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  getNlpPrediction(text) {
    return apiClient.post(
      "http://127.0.0.1:8080/api/predict",
      JSON.stringify(text),
    );
  },
  async fetchNlpPrediction(text) {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error("An error occurred during the prediction request.");
      }

      const data = await response.json();
      console.log("data", data);
      return data;
    } catch (error) {
      throw new Error(
        "An error occurred during the prediction request: " + error.message,
      );
    }
  },
};
