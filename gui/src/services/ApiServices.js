export default {
  async fetchNlpPrediction(text) {
    try {
      const response = await fetch(import.meta.env.VITE_NLP_API_ENDPOINT, {
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
      return data;
    } catch (error) {
      throw new Error(
        "An error occurred during the prediction request: " + error.message,
      );
      return error;
    }
  },
};
