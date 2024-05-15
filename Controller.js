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
    const token = req.body.token;

  const sql='SELECT token FROM Address WHERE token = ?';
  db.query(sql, [token], (err, resul) =>{
    if(err){
      console.error("Erro ao verificar token de cadastro", err);
      return res.status(500).json({ Error: 'Erro ao verificar token de cadastro.' });
    }else{
      if(resul.length > 1){
        return res.status(200).json({ Message: 'found' });
      }else{
        const sqlInsert="INSERT INTO Address (street, number, neighborhood, city, token, CEP) VALUES (?,?,?,?,?)";
        db.query(sqlInsert, [newStreet, newNumber, newBairro, newCity, token, newCEP], (erro, result) =>{
          if(err){
            console.error("Erro ao cadastrar endereço", err);
            return res.status(500).json({ Error: 'Erro cadastrar endereço.' });
          }else{
              if(result){
                const sqlAddress_id='SELECT id FROM Address WHERE token = ?';
                db.query(sqlAddress_id, [token], (error, resulta) =>{
                  if(err){
                    console.error("Erro ao buscar id do endereço.", err);
                    return res.status(500).json({ Error: 'Erro ao buscar id do endereço.' });
                  }else{
                    
                  }
                })
              }
          }
        } )
      }
    }
  })
})


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });