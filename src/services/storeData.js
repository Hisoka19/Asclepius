const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  try {
    console.log('Initializing Firestore');
    const db = new Firestore({
      projectId: 'submissionmlgc-iqbalrafi', // Ganti dengan Project ID Anda
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS // Menggunakan variabel lingkungan
    });

    console.log('Storing data to Firestore with id:', id);
    const predictCollection = db.collection('prediction');
    await predictCollection.doc(id).set(data);
    console.log('Data stored successfully');
  } catch (error) {
    console.error('Error storing data:', error); // Logging kesalahan untuk debug
    throw new Error('Failed to store data');
  }
}

module.exports = storeData;
