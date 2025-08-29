const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

const uri = 'mongodb://mongo:27017';
const client = new MongoClient(uri);

const dbName = 'testdb';

async function start() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    app.get('/', async (req, res) => {
      try {
        const db = client.db(dbName);
        const collection = db.collection('timestamps');

        await collection.insertOne({ time: new Date() });

        const docs = await collection.find().sort({ _id: -1 }).limit(5).toArray();

        res.json(docs);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data from MongoDB');
      }
    });

    app.listen(3000, '0.0.0.0', () => {
      console.log('App running on port 3000');
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

start();

