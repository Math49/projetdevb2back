const admin = require('firebase-admin');
const serviceAccount = require('./espl-c563e-firebase-adminsdk-bl545-eb219ee716.json'); // Modifie ce chemin

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "eslp.firebaseapp.com" // Remplace par ton URL
});

module.exports = admin;
