const admin = require('firebase-admin');
const serviceAccount = require('./eslp-hub-firebase-adminsdk-y602w-4c7550a770.json'); // Modifie ce chemin

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "eslp-hub.firebaseapp.com" // Remplace par ton URL
});

module.exports = admin;
