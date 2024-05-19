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
        const sqlInsert="INSERT INTO Address (street, number, neighborhood, city, token, CEP) VALUES (?,?,?,?,?,?)";
        db.query(sqlInsert, [newStreet, newNumber, newBairro, newCity, token, newCEP], (erro, result) =>{
          if(erro){
            console.error("Erro ao cadastrar endereço", erro);
            return res.status(500).json({ Error: 'Erro cadastrar endereço.' });
          }else{
              if(result){
                const sqlAddress_id='SELECT id FROM Address WHERE token = ?';
                db.query(sqlAddress_id, [token], (error, resulta) =>{
                  if(error){
                    console.error("Erro ao buscar id do endereço.", err);
                    return res.status(500).json({ Error: 'Erro ao buscar id do endereço.' });
                  }else{
                    if(resulta.length > 0){
                        const addressId = resulta[0].id;
                        const sqlInsertPatient="INSERT INTO patient (address_id, name, date_birth, registration_date, laudo, token) VALUES (?,?,?,?,?,?)";
                        db.query(sqlInsertPatient, [addressId, newName, newDateBirth, newDateCreation, hasLaudo, token], (errorPatient, resultad) =>{
                          if(errorPatient){
                            console.error("Erro ao cadastrar paciente.", errorPatient);
                            return res.status(500).json({ Error: 'Erro ao cadastrar paciente.' });
                          }else{
                            if(resultad){
                              const sqlPatientId="SELECT id FROM patient WHERE token = ?";
                              db.query(sqlPatientId, [token], (errorPatientId, resultado) =>{
                                if(errorPatientId){
                                  console.error("Erro ao buscar id do paciente.", errorPatientId);
                                  return res.status(500).json({ Error: 'Erro ao buscar id do paciente.' });
                                }else{
                                  if(resultado.length > 0){
                                    const patientId = resultado[0].id;
                                    const sqlInsertCID="INSERT INTO CID (patient_id, code_cid) VALUES (?,?)";
                                    db.query(sqlInsertCID, [patientId, newCID], (errorCID, resultCID) =>{
                                      if(errorCID){
                                        console.error("Erro ao cadastrar a CID do paciente.", errorCID);
                                        return res.status(500).json({ Error: 'Erro ao cadastrar a CID do paciente.' });
                                      }else{
                                        if(resultCID){
                                        return res.status(200).json({ Success: 'Success' });
                                        }
                                      }
                                    })
                                  }
                                }
                              })
                            }
                          }
                        })
                    }
                  }
                })
              }
          }
        } )
      }
    }
  })
})

app.get('/api/patients/', (req, res) =>{
  const sql=`SELECT *
              FROM patient AS paciente
              JOIN CID ON CID.patient_id = paciente.id
              JOIN Address ON Address.id = paciente.address_id;`;
  db.query(sql, (err, result) =>{
    if(err){
      console.error("Erro ao buscar pacientes.", err);
      return res.status(500).json({ Error: 'Erro ao buscar pacientes.' });
    }else{
      if(result.length > 0){
        return res.status(200).json({Success: 'Success', result})
      }
    }
  })
})

app.post('/api/AddNewColaborador/', (req, res) =>{

    const newName = req.body.newName;
    const newProfession = req.body.newProfession;
    const newCPF = req.body.newCPF;
    const newDateCreation = req.body.newDateCreation;
    const isWorking = req.body.isWorking;
    const newObservation = req.body.newObservation;

    const sql='SELECT CPF FROM Professional WHERE CPF = ?';
    db.query(sql, [newCPF], (err, resu) =>{
      if(err){
        console.error("Erro ao verificar existencia colaborador.", err);
        return res.status(500).json({ Error: 'Erro ao verificar existencia colaborador.' });
      }else{
        if(resu.length > 0){
          console.log(resu)
          return res.status(200).json({Message: 'Found'})
        }else{
          const sqlInsert='INSERT INTO Professional (name, profession, creation_date, situation, observation, CPF) VALUES (?,?,?,?,?,?)';
          db.query(sqlInsert, [newName, newProfession, newDateCreation, isWorking, newObservation, newCPF], (erro, resul) =>{
            if(erro){
              console.error("Erro ao cadastrar colaborador.", erro);
              return res.status(500).json({ Error: 'Erro ao cadastrar colaborador.'});
            }else{
              if(resul){
                return res.status(200).json({Message: 'Success'})
              }
            }
          })
        }
      }
    })
})

app.get('/api/colaboradores/', (re, res) =>{
  const sql='Select * from Professional';
  db.query(sql, (err, resul) =>{
    if(err){
      console.error("Erro ao buscar colaboradores.", err);
      return res.status(500).json({ Error: 'Erro ao buscar colaboradores.' });
    }else{
      if(resul.length > 0){
        return res.status(200).json({Success: 'Success', resul})
      }
    }
  })
})

app.get('/api/get-colaboradores/:SearchColaborador', (req, res) =>{
  const SearchColaborador = req.params.SearchColaborador;

  const sql='SELECT id, name, profession FROM Professional WHERE name = ?';
  db.query(sql, [SearchColaborador], (err, resul) =>{
    if(err){
      console.error("Erro ao buscar colaboradores.", err);
      return res.status(500).json({ Error: 'Erro ao buscar colaboradores.' });
    }else{
      if(resul.length > 0){
        return res.status(200).json({Success: 'Success', resul})
      }else{
        return res.status(200).json({Success: 'falied'})
      }
    }
  })
})

app.get('/api/get-pacientes/:SearchPaciente', (req, res) =>{
  const SearchPaciente = req.params.SearchPaciente;

  const sql='SELECT id, name FROM patient WHERE name = ?';
  db.query(sql, [SearchPaciente], (err, resul) =>{
    if(err){
      console.error("Erro ao buscar paciente.", err);
      return res.status(500).json({ Error: 'Erro ao buscar paciente.' });
    }else{
      if(resul.length > 0){
        return res.status(200).json({Success: 'Success', resul})
      }else{
        return res.status(200).json({Success: 'falied'})
      }
    }
  })
})

app.get('/api/get-paciente/:SearchPaciente', (req, res) =>{
  const SearchPaciente = req.params.SearchPaciente;

  const sql='SELECT id, name, date_birth FROM patient WHERE name = ?';
  db.query(sql, [SearchPaciente], (err, resul) =>{
    if(err){
      console.error("Erro ao buscar paciente.", err);
      return res.status(500).json({ Error: 'Erro ao buscar paciente.' });
    }else{
      if(resul.length > 0){
        return res.status(200).json({Success: 'Success', resul})
      }else{
        return res.status(200).json({Success: 'falied'})
      }
    }
  })
})

app.get('/api/get-services/', (req, res) =>{
  const sql='SELECT * FROM nameServices';
  db.query(sql, (err, resu) =>{
    if(err){
      console.error("Erro ao buscar tipos de atendimentos.", err);
      return res.status(500).json({ Error: 'Erro ao buscar tipos de atendimentos.' });
    }else{
      if(resu.length > 0){
        return res.status(200).json({Success: 'Success', resu})
      }else{
        return res.status(200).json({Success: 'falied'})
      }
    }
  })
})

app.post('/api/addNewService/:newService', (req, res) =>{
  const newService = req.params.newService;

  const sql='INSERT INTO nameServices (name) VALUES (?)';
  db.query(sql, [newService], (err, resu) =>{
    if(err){
      console.error("Erro ao cadastrar tipo de atendimento.", err);
      return res.status(500).json({ Error: 'Erro ao cadastrar tipo de atendimento.' });
    }else{
      if(resu){
        return res.status(200).json({Success: 'Success'})
      }
    }
  })
})

app.get('/api/atendimentos/', (req, res) =>{

  const status = 'Não realizado';

  const sql=`SELECT
              service.id AS service_id,
              service.date_service, 
              service.status, 
              paciente.name AS paciente_name, 
              profissional.name AS profissional_name, 
              nameService.name AS service_name
            FROM Services AS service
            JOIN patient AS paciente ON paciente.id = service.patient_id
            JOIN Professional AS profissional ON profissional.id = service.professional_id
            JOIN nameServices AS nameService ON nameService.id = service.nameService_id
            WHERE status = ?`;

  db.query(sql, [status], (err, resu) =>{
    if(err){
      console.error("Erro ao buscar atendimentos.", err);
      return res.status(500).json({ Error: 'Erro ao buscar atendimentos.' });
    }else{
      if(resu.length > 0){
        return res.status(200).json({Success: 'Success', resu})
      }else{
        return res.status(200).json({Success: 'falied'})
      }
    }
  })
})

app.post('/api/addNewAtendimento/', (req, res) =>{
  const newDateService = req.body.newDateService;
  const serviceId = req.body.serviceId;
  const colaboradoreId = req.body.colaboradoreId;
  const pacienteId = req.body.pacienteId;
  const status = 'Não realizado'

  const sql='INSERT INTO Services (patient_id, professional_id, nameService_id, date_service, status) VALUES (?,?,?,?,?)';
  db.query(sql, [pacienteId, colaboradoreId, serviceId, newDateService, status], (err, resu) =>{
    if(err){
      console.error("Erro ao cadastrar atendimento.", err);
      return res.status(500).json({ Error: 'Erro ao cadastrar atendimento.' });
    }else{
      if(resu){
        return res.status(200).json({Success: 'Success'})
      }
    }
  })
})

app.post('/api/closeService/:atendimento_id', (req, res) =>{
  const atendimentoId = req.params.atendimento_id;
  const status = 'Realizado'

  const sql='UPDATE Services SET  status = ? WHERE id = ?';
  db.query(sql, [status, atendimentoId], (err, resul) =>{
    if(err){
      console.error("Erro ao atualizar status do atendimento.", err);
      return res.status(500).json({ Error: 'Erro ao atualizar status do atendimento.' });
    }else{
      if(resul){
        return res.status(200).json({Success: 'Success'})
      }
    }
  })
})

//Route to generate report by patient
app.get('/api/generateReportByPatient/:pacienteId', (req, res) => {
  const pacienteId = req.params.pacienteId;
  const status = 'Realizado';

  const sql = `SELECT
                  service.id AS service_id,
                  paciente.name AS patient_name,
                  profissional.name AS professional_name,
                  nameService.name AS name_service,
                  service.date_service AS data_servico
                FROM Services AS service
                JOIN patient AS paciente ON paciente.id = service.patient_id
                JOIN Professional AS profissional ON profissional.id = service.professional_id
                JOIN nameServices AS nameService ON nameService.id = service.nameService_id
                WHERE service.patient_id = ? 
                  AND service.status = ?
              `;

  db.query(sql, [pacienteId, status], (err, result) =>{
    if(err){
      console.error("Erro ao gerar relatório.", err);
      return res.status(500).json({ Error: 'Erro ao gerar relatório.' });
    }else{
      if(result.length > 0){
        return res.status(200).json({Success: 'Success', result})
      }else{
        return res.status(200).json({Success: 'falied'})
      }
    }
  })
})

app.get('/api/generateReport/:pacienteId/:serviceId/:dateInitial/:dateFinal', (req, res) => {
  const pacienteId = req.params.pacienteId;
  const serviceId = req.params.serviceId;
  const dateInitial = req.params.dateInitial;
  const dateFinal = req.params.dateFinal;

  const status = 'Realizado';

  const sql = `SELECT
                  service.id AS service_id,
                  paciente.name AS patient_name,
                  profissional.name AS professional_name,
                  nameService.name AS name_service,
                  service.date_service AS data_servico
                FROM Services AS service
                JOIN patient AS paciente ON paciente.id = service.patient_id
                JOIN Professional AS profissional ON profissional.id = service.professional_id
                JOIN nameServices AS nameService ON nameService.id = service.nameService_id
                WHERE service.patient_id = ? 
                  AND service.nameService_id = ?
                  AND service.date_service BETWEEN ? AND ?
                  AND service.status = ?
              `;

  db.query(sql, [pacienteId, serviceId, dateInitial, dateFinal, status], (err, result) =>{
    if(err){
      console.error("Erro ao gerar relatório.", err);
      return res.status(500).json({ Error: 'Erro ao gerar relatório.' });
    }else{
      if(result.length > 0){
        return res.status(200).json({Success: 'Success', result})
      }else{
        return res.status(200).json({Success: 'falied'})
      }
    }
  })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });