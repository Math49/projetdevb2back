const express = require('express');
const admin = require('./routes/firebaseAdmin'); // Importe le module Firebase que tu viens de créer
const { getAuth } = require('firebase-admin/auth');
const app = express();
const port = 3000;

const customClaims = {admin: true, personnel: true, etudiant: true};


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');

  // Pass to next layer of middleware
  next();
});

app.post('/addData',async (req,res) => {
  const uid = 'o9KGa33jmjSTVf1oLK5rCm6TCEi2';
  const usersCollection = admin.firestore().collection('users');

  usersCollection.doc(uid).set({
    roles: 'etudiant',
    photoURL: 'photoProfil',
    idprojet: 'jgijeafjbejbroazi',
  })
  .then(() => {
    console.log('Informations de l\'utilisateur ajoutées avec succès à Firestore.');
  })
  .catch((error) => {
    console.error('Erreur lors de l\'ajout des informations de l\'utilisateur à Firestore :', error);
  });
});

// app.use(express.json());


// Route pour l'inscription
app.post('/signup', async (req, res) => {
  // const { email, password, prenom, nom } = req.body;
  console.log(req.body);
  try {
    const user = await getAuth().createUser({email, password});
    console.log(user);
    const uid = user.uid;
    const usersCollection = admin.firestore().collection('users');

    usersCollection.doc(uid).set({
      email: email,
      uid: uid,
      prenom: prenom,
      nom: nom,
      roles: 'etudiant',
      photoURL: 'photoProfil'
    })
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
