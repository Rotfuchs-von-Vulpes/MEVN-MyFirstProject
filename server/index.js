import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient } from "mongodb";

const app = express();

app.use(cors())

app.get('/', (req, res) => {
  res.send('Funcionou!');
})

let db;
MongoClient.connect(process.env.URL, (err, client) => {
  if (err) return console.log(err);
  db = client.db('mevnDataBase');

  app.listen(3001, function() {
    console.log('servidor rodando na porta 3001');
  });
})