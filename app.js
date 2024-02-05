const express = require('express');
const admin = require('./routes/firebaseAdmin'); // Importe le module Firebase que tu viens de créer
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

app.get('/importProjet', async (req, res) => {
  const db = admin.firestore();
  try {
    const snapshot = await db.collection('Projet').get();
    console.log(snapshot.docs);
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
  console.log(req);
  const Data = req.body;
  console.log(Data);
  try {

    const projetData = {
      concept: Data.concept,
      description: Data.description,
      nom: Data.nom,
      objectifs: Data.objectifs,
      competences: Data.competences
    }

    const docRef = await db.collection('Projet').add(projetData);
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
