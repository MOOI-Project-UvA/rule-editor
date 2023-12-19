export default {
  async fetchNlpPrediction(text) {
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
  },
};
