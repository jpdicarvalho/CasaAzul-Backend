import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import mysql from "mysql2";

import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Create the connection to the database mysql on PlanetScale
const db = mysql.createConnection(process.env.DATABASE_URL)

// Verify connection to the database
db.connect((error) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados!');
  }
});

app.post('/api/AddNewPatient/', (req, res) =>{
 
    const newName = req.body.newName;
    const newDateBirth = req.body.newDateBirth;
    const newCEP = req.body.newCEP;
    const newStreet = req.body.newStreet;
    const newNumber = req.body.newNumber;
    const newBairro = req.body.newBairro;
    const newCity = req.body.newCity;
    const newDateCreation = req.body.newDateCreation;
    const hasLaudo = req.body.hasLaudo;
    const newCID = req.body.newCID;

  console.log(newName, newDateBirth)
})


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });