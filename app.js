const express = require('express');
const admin = require('./routes/firebaseAdmin'); // Importe le module Firebase que tu viens de créer
const app = express();
const port = 3000;

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');

  // Pass to next layer of middleware
  next();
});

app.get('/importProjet', async (req, res) => {
  const db = admin.firestore();
  try {
    const snapshot = await db.collection('Projet').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/AddProjet', async (req, res) => {
  const db = admin.firestore();
  try {

    const projetData = {
      concept: 'nouveau projet',
      description: 'Lorem Ipsum',
      id: 7,
      nom: 'projet bdd',
      objectifs: 'supprimer element bdd',
      competences: {
        "dev": true,
        "design": true
      }
    }

    const addBdd = await db.collection('Projet').add(projetData);
    
    res.status(200).send('Document ajouté avec succès: ' + addBdd.id);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
