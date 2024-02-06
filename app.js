const express = require('express');
const admin = require('./routes/firebaseAdmin'); // Importe le module Firebase que tu viens de créer
const { getAuth } = require('firebase-admin/auth');
const app = express();
const cors = require('cors');
const port = 3000;


const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(
  cors({
  origin: 'http://localhost:3002', // Autorise les requêtes provenant de cette origine
  allowedHeaders: ['Content-Type'], // Autorise ces en-têtes dans les requêtes
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Autorise ces méthodes de requête
}));

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
    const data = snapshot.docs.map(doc => {
      return {...doc.data(), uid: doc.id};
    });
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
  
});

app.put('/addProjet', async (req, res) => {
  const db = admin.firestore();
  const Data = req.body;
  try {

    const projetData = {
      concept: Data.concept,
      description: Data.description,
      nom: Data.nom,
      objectifs: Data.objectifs,
      competences: Data.competences
    }

    const docRef = await db.collection('Projet-Validation').add(projetData);
    res.status(200).send('Document ajouté avec succès: ' + docRef.id);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
