const express = require('express');
const admin = require('./routes/firebaseAdmin'); // Importe le module Firebase que tu viens de créer
const { getAuth, signInWithEmailAndPassword } = require('firebase-admin/auth');
const app = express();
const port = 3000;


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');

  // Pass to next layer of middleware
  next();
});


// app.use(express.json());

// Middleware pour vérifier l'authentification de l'utilisateur
const isAuthenticated = async (req, res, next) => {
  const idToken = req.headers.authorization;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('You are not authorized');
  }
};

// Route pour l'inscription
app.post('/signup', async (req, res) => {
  const { email, password } = {email:'etudiant2@gmail.com',password:'123456'};
// req.body
  try {
    const user = await getAuth().createUser({email, password});
    console.log(user);
    res.status(200).json({ message: 'Signup successful', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Route pour la connexion
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmail(getAuth(), email, password);
    const user = userCredential.user;
    console.log(user);
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
  

// Route pour la déconnexion
app.post('/logout', isAuthenticated, async (req, res) => {
  try {
    const auth = getAuth();
    await signOut(auth);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
