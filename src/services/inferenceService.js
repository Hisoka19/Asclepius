const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat();

  const prediction = model.predict(tensor);
  const score = await prediction.data();
  const confidenceScore = score[0] * 100;

  let label, suggestion;

  if (confidenceScore > 50) {
    label = 'Cancer';
    suggestion = "Segera periksa ke dokter!";
  } else {
    label = 'Non-cancer';
    suggestion = "Tidak ada tanda-tanda kanker.";
  }

  return { confidenceScore, label, suggestion };
}

module.exports = predictClassification;
