const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
  try {
    console.log('Received request for prediction');
    const { image } = request.payload;
    const { model } = request.server.app;

    console.log('Starting model prediction');
    const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
    console.log('Model prediction completed:', { confidenceScore, label, explanation, suggestion });

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      "id": id,
      "result": label,
      "suggestion": suggestion,
      "createdAt": createdAt
    };

    console.log('Storing prediction result');
    await storeData(id, data); // Pastikan fungsi ini tidak menimbulkan kesalahan
    console.log('Prediction result stored successfully');

    const response = h.response({
      status: 'success',
      message: confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
      data
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('Error in postPredictHandler:', error); // Logging kesalahan untuk debug
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    });
    response.code(500);
    return response;
  }
}

module.exports = postPredictHandler;
