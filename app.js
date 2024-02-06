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

app.get('/importProjet', async (req, res) => {
  const db = admin.firestore();
  try {
    const snapshot = await db.collection('Projet').get();
    const data = snapshot.docs.map(doc => {
      return {...doc.data(), uid: doc.id};
    });
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
