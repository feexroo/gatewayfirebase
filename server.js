// server.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000; // Port akan otomatis ditentukan oleh Render

// Firebase konfigurasi
const FIREBASE_URL = process.env.FIREBASE_URL; // Ganti dengan URL Firebase Anda
const FIREBASE_SECRET = process.env.FIREBASE_SECRET; // Ganti dengan secret code Firebase Anda

// Periksa apakah Firebase URL dan Secret diatur
if (!FIREBASE_URL || !FIREBASE_SECRET) {
  console.error('FIREBASE_URL atau FIREBASE_SECRET tidak diatur di Environment Variables.');
  process.exit(1); // Keluar jika konfigurasi tidak lengkap
}

// Middleware
app.use(bodyParser.json());

// Endpoint untuk POST data ke Firebase
app.post('/send-to-firebase', async (req, res) => {
  try {
    const { path, data } = req.body;

    // Validasi data
    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing "path". It must be a string.' });
    }

    if (data === undefined || (typeof data !== 'object' && typeof data !== 'number' && typeof data !== 'string')) {
      return res.status(400).json({ error: 'Invalid or missing "data". It must be an object, number, or string.' });
    }

    // Kirim data ke Firebase
    const firebaseUrl = `${FIREBASE_URL}${path}.json?auth=${FIREBASE_SECRET}`;
    await axios.put(firebaseUrl, data);

    res.json({ success: true, message: 'Data sent to Firebase successfully.', sentData: data });
  } catch (error) {
    console.error('Error sending data to Firebase:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint untuk GET data dari Firebase
app.get('/get-from-firebase', async (req, res) => {
  try {
    const { path } = req.query;

    // Validasi path
    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing "path". It must be a string.' });
    }

    // Ambil data dari Firebase
    const firebaseUrl = `${FIREBASE_URL}${path}.json?auth=${FIREBASE_SECRET}`;
    const response = await axios.get(firebaseUrl);

    res.json({ success: true, message: 'Data retrieved from Firebase successfully.', data: response.data });
  } catch (error) {
    console.error('Error retrieving data from Firebase:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
