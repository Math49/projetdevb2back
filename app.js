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
// app.use(express.json());


// Route pour l'inscription
app.post('/signup', async (req, res) => {
  const { userEmail, userPassword, prenom, nom, role } = req.body;
  
  try {
    const user = await getAuth().createUser({
      email: userEmail, 
      password: userPassword 
    });
    const uid = user.uid;
    const usersCollection = admin.firestore().collection('users');

    usersCollection.doc(uid).set({
      email: userEmail,
      uid: uid,
      prenom: prenom,
      nom: nom,
      roles: role,
      photoURL: 'photoProfil' 
    });
    res.status(200).json({ message: 'Signup successful', user });
  } catch (error) {
    console.error("Signup error: ", error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/importUser', async (req, res) => {
  const db = admin.firestore();
  try {
    const snapshot = await db.collection('users').get();
    const data = snapshot.docs.map(doc => {
      return {...doc.data(), uid: doc.id};
    });
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
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

app.get('/importProjetValidation', async (req, res) => {
  const db = admin.firestore();
  try {
    const snapshot = await db.collection('Projet-Validation').get();
    const data = snapshot.docs.map(doc => {
      return {...doc.data(), uid: doc.id};
    });
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
  
});

app.get('/importProjetProgress', async (req, res) => {
  const db = admin.firestore();
  try {
    const snapshot = await db.collection('Projet-Progress').get();
    const data = snapshot.docs.map(doc => {
      return {...doc.data(), uid: doc.id};
    });
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
  
});

app.get('/importProjetFinished', async (req, res) => {
  const db = admin.firestore();
  try {
    const snapshot = await db.collection('Projet-Finished').get();
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

app.delete('/valideProjet/:uid', async (req, res) => {
  const db = admin.firestore();
  const uid = req.params.uid;
  try {
    const projetDoc = await db.collection('Projet-Validation').doc(uid).get();
    if (!projetDoc.exists) {
      res.status(404).json({ message: 'Projet not found' });
    } else {
      const projetData = projetDoc.data();
      await db.collection('Projet').doc(uid).set(projetData);
      await db.collection('Projet-Validation').doc(uid).delete();
      res.status(200).json({ message: 'Projet deleted and moved to Projet collection' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/progressProjet/:uid', async (req, res) => {
  const db = admin.firestore();
  const uid = req.params.uid;
  try {
    const projetDoc = await db.collection('Projet').doc(uid).get();
    if (!projetDoc.exists) {
      res.status(404).json({ message: 'Projet not found' });
    } else {
      const projetData = projetDoc.data();
      await db.collection('Projet-Progress').doc(uid).set(projetData);
      await db.collection('Projet').doc(uid).delete();
      res.status(200).json({ message: 'Projet deleted and moved to Projet collection' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/finishedProjet/:uid', async (req, res) => {
  const db = admin.firestore();
  const uid = req.params.uid;
  try {
    const projetDoc = await db.collection('Projet-Progress').doc(uid).get();
    if (!projetDoc.exists) {
      res.status(404).json({ message: 'Projet not found' });
    } else {
      const projetData = projetDoc.data();
      await db.collection('Projet-Finished').doc(uid).set(projetData);
      await db.collection('Projet-Progress').doc(uid).delete();
      res.status(200).json({ message: 'Projet deleted and moved to Projet collection' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
