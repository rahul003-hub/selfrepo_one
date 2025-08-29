const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

// MongoDB connection URI (no credentials)
const uri = 'mongodb://mongo:27017';
const client = new MongoClient(uri);

const dbName = 'testdb';  // new DB we want to create

app.get('/', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('timestamps');

    // Insert current timestamp
    await collection.insertOne({ time: new Date() });

    // Get last 5 documents
    const docs = await collection.find().sort({ _id: -1 }).limit(5).toArray();

    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to MongoDB');
  } finally {
    await client.close();
  }
});

app.listen(3000, '0.0.0.0', () => console.log('App running on port 3000'));
