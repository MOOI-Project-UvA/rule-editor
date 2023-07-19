// It connects to the API of the NLP endpoint
async function makePrediction(text) {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('An error occurred during the prediction request.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('An error occurred during the prediction request: ' + error.message);
  }
}

export { makePrediction };
