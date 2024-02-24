const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql/msnodesqlv8");

const app = express();
const port = 3000;

var config = {
  server: "DESKTOP-K3NQCCN\\SQLEXPRESS",
  database: "Evidenta dotarilor din facultate",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    //afisam fiecare tabel cu datele sale
    var request = new sql.Request();
    request.query("select * from Departamente", function (error, firstSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      var anotherRequest = new sql.Request();
      anotherRequest.query("select * from Studenti", function (error, secondSet) {
        if (error) {
          console.log(error);
          res.send("Error querying the database");
          sql.close();
          return;
        }

        var thirdRequest = new sql.Request();
        thirdRequest.query("select * from Dotari", function (error, thirdSet) {
          if (error) {
            console.log(error);
            res.send("Error querying the database");
            sql.close();
            return;
          }

          var fourthRequest = new sql.Request();
          fourthRequest.query("select * from Dotari_Sali", function (error, fourthSet) {
            if (error) {
              console.log(error);
              res.send("Error querying the database");
              sql.close();
              return;
            }

            var fifthRequest = new sql.Request();
            fifthRequest.query("select * from Facultate", function (error, fifthSet) {
              if (error) {
                console.log(error);
                res.send("Error querying the database");
                sql.close();
                return;
              }

              var sixthRequest = new sql.Request();
              sixthRequest.query("select * from Sali", function (error, sixthSet) {
                if (error) {
                  console.log(error);
                  res.send("Error querying the database");
                  sql.close();
                  return;
                }

                res.render("index", { 
                  firstSet: firstSet.recordset, 
                  secondSet: secondSet.recordset, 
                  thirdSet: thirdSet.recordset,
                  fourthSet: fourthSet.recordset,
                  fifthSet: fifthSet.recordset,
                  sixthSet: sixthSet.recordset
                });

                sql.close();
              });
            });
          });
        });
      });
    });
  });
});

// Update pentru departamente
app.post("/update", (req, res) => {
  const { idToUpdate, updatedField, updatedValue } = req.body;

  if (!idToUpdate || !updatedField || !updatedValue) {
    res.status(400).send("Incomplete data for update");
    return;
  }

  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.status(500).send("Error connecting to the database");
      return;
    }

    var updateRequest = new sql.Request();
    updateRequest.query(
      `UPDATE Departamente SET ${updatedField} = '${updatedValue}' WHERE ID_Departament = '${idToUpdate}'`,
      function (error, result) {
        if (error) {
          console.log(error);
          res.status(500).send("Error updating the database");
        } else {
       res.redirect("/");
      }

        sql.close();
      }
    );
  });
});

// Update pentru studenti
app.post("/update-page-student", (req, res) => {
  const { idToUpdate, updatedField, updatedValue } = req.body;

  if (!idToUpdate || !updatedField || !updatedValue) {
    res.render("update-page-student", { idToUpdate, error: "Incomplete data for update" });
    return;
  }

  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.status(500).send("Error connecting to the database");
      return;
    }

    var updateStudentRequest = new sql.Request();
    updateStudentRequest.query(
      `UPDATE Studenti SET ${updatedField} = '${updatedValue}' WHERE ID_Student = '${idToUpdate}'`,
      function (error, result) {
        if (error) {
          console.log(error);
          res.status(500).send("Error updating the database");
        } else {
          res.redirect("/"); 
        }

        sql.close();
      }
    );
  });
});


// Insert pentru departamente
app.post("/insert", (req, res) => {
  const { idDepartament, nume, codDepartament, decan, idFacultate } = req.body;

  if (!nume || !codDepartament || !decan || !idFacultate) {
    res.status(400).send("Incomplete data for insertion");
    return;
  }

  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.status(500).send("Error connecting to the database");
      return;
    }

    var insertRequest = new sql.Request();
    insertRequest.query(
      `INSERT INTO Departamente (ID_Departament, Nume, Cod_Departament, Decan, ID_Facultate) VALUES ('${idDepartament}','${nume}', '${codDepartament}', '${decan}', '${idFacultate}')`,
      function (error, result) {
        if (error) {
          console.log(error);
          res.status(500).send("Error inserting into the database");
        } else {
          res.redirect(req.get('referer'));
        }
        
        sql.close();
      }
    );
  });
});

app.get("/update-page", (req, res) => {
  const idToUpdate = req.query.idToUpdate;
  res.render("update-page", { idToUpdate });
});

app.post("/update-page-student", (req, res) => {
  const idToUpdate = req.query.idToUpdate;
  res.render("update-page-student", { idToUpdate });
});

// Delete pentru departamente
app.post("/delete", (req, res) => {
  const { idToDelete } = req.body;

  if (!idToDelete) {
    res.status(400).send("Incomplete data for deletion");
    return;
  }

  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.status(500).send("Error connecting to the database");
      return;
    }

    var deleteRequest = new sql.Request();
    deleteRequest.query(`DELETE FROM Departamente WHERE ID_Departament = '${idToDelete}'`, function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).send("Error deleting from the database");
      } else {
        res.redirect('back');
      }

      sql.close();
    });
  });
});

// Insert pentru Studenti
app.post("/insert-student", (req, res) => {
  const { idStudent, nume, prenume, cnp, email, sex, dataNasterii, idDepartament } = req.body;

  if (!nume || !prenume || !cnp || !email || !sex || !dataNasterii || !idDepartament) {
    res.status(400).send("Incomplete data for insertion");
    return;
  }

  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.status(500).send("Error connecting to the database");
      return;
    }

    var insertStudentRequest = new sql.Request();
    insertStudentRequest.query(
      `INSERT INTO Studenti (ID_Student, Nume, Prenume, CNP, Email, Sex, Data_nasterii, ID_Departament) VALUES ('${idStudent}', '${nume}', '${prenume}', '${cnp}', '${email}', '${sex}', '${dataNasterii}', '${idDepartament}')`,
      function (error, result) {
        if (error) {
          console.log(error);
          res.status(500).send("Error inserting into the database");
        } else {
          res.redirect(req.get('referer'));
        }
        
        sql.close();
      }
    );
  });
});

// Delete pentru studenti
app.post("/delete-student", (req, res) => {
  const { idToDelete } = req.body;

  if (!idToDelete) {
    res.status(400).send("Incomplete data for student deletion");
    return;
  }

  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.status(500).send("Error connecting to the database");
      return;
    }

    var deleteStudentRequest = new sql.Request();
    deleteStudentRequest.query(`DELETE FROM Studenti WHERE ID_Student = '${idToDelete}'`, function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).send("Error deleting student from the database");
      } else {
        res.redirect('back');
      }

      sql.close();
    });
  });
});


//interogari simple
app.post("/afisareDotariSali", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var dotariSaliQuery = `
      SELECT S.Numar, S.Capacitate, DS.ID_Dotare, D.Nume AS Nume_Dotare
      FROM Sali S
      JOIN Dotari_Sali DS ON S.ID_Sala = DS.ID_Sala
      JOIN Dotari D ON DS.ID_Dotare = D.ID_Dotare;
    `;

    var dotariSaliRequest = new sql.Request();
    dotariSaliRequest.query(dotariSaliQuery, function (error, dotariSaliSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareDotariSali", { dotariSaliSet: dotariSaliSet.recordset });

      sql.close();
    });
  });
});


app.post("/afisareStudentiSistemeElectroenergetice", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var studentiQuery = `
      SELECT S.Nume, S.Prenume
      FROM Studenti S
      JOIN Departamente D ON S.ID_Departament = D.ID_Departament
      WHERE D.Nume = 'Sisteme Electroenergetice' AND YEAR(S.Data_nasterii) >= 2002;
    `;

    var studentiRequest = new sql.Request();
    studentiRequest.query(studentiQuery, function (error, studentiSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareStudentiSistemeElectroenergetice", { studentiSet: studentiSet.recordset });

      sql.close();
    });
  });
});


app.post("/afisareSaliCuCalculatoare", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var saliCuCalculatoareQuery = `
      SELECT DISTINCT S.*
      FROM Sali S
      JOIN Dotari_Sali DS ON S.ID_Sala = DS.ID_Sala
      JOIN Dotari D ON DS.ID_Dotare = D.ID_Dotare
      WHERE D.Nume = 'Calculatoare';
    `;

    var saliCuCalculatoareRequest = new sql.Request();
    saliCuCalculatoareRequest.query(saliCuCalculatoareQuery, function (error, saliCuCalculatoareSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareSaliCuCalculatoare", { saliCuCalculatoareSet: saliCuCalculatoareSet.recordset });

      sql.close();
    });
  });
});

app.post("/afisareNumarStudentiPeDepartament", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var numarStudentiPeDepartamentQuery = `
      SELECT D.Nume AS Nume_Departament, COUNT(S.ID_Student) AS Numar_Studenti
      FROM Departamente D
      LEFT JOIN Studenti S ON D.ID_Departament = S.ID_Departament
      GROUP BY D.Nume;
    `;

    var numarStudentiPeDepartamentRequest = new sql.Request();
    numarStudentiPeDepartamentRequest.query(numarStudentiPeDepartamentQuery, function (error, numarStudentiSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareNumarStudentiPeDepartament", { numarStudentiSet: numarStudentiSet.recordset });

      sql.close();
    });
  });
});


app.post("/afisareTop5Studenti", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var top5StudentiQuery = `
      SELECT TOP 5 *
      FROM Studenti
      WHERE ID_Departament IN (SELECT ID_Departament FROM Departamente)
      ORDER BY Data_nasterii ASC;
    `;

    var top5StudentiRequest = new sql.Request();
    top5StudentiRequest.query(top5StudentiQuery, function (error, top5StudentiSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareTop5Studenti", { top5StudentiSet: top5StudentiSet.recordset });

      sql.close();
    });
  });
});


app.post("/afisareNumarSaliPeDotare", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var numarSaliPeDotareQuery = `
      SELECT D.Nume AS Nume_Dotare, COUNT(DS.ID_Sala) AS Numar_Sali
      FROM Dotari D
      LEFT JOIN Dotari_Sali DS ON D.ID_Dotare = DS.ID_Dotare
      GROUP BY D.Nume;
    `;

    var numarSaliPeDotareRequest = new sql.Request();
    numarSaliPeDotareRequest.query(numarSaliPeDotareQuery, function (error, numarSaliPeDotareSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareNumarSaliPeDotare", { numarSaliPeDotareSet: numarSaliPeDotareSet.recordset });

      sql.close();
    });
  });
});


app.post("/afisareStudentiFacultate", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var studentiFacultateQuery = `
      SELECT S.Nume, S.Prenume, F.Nume AS Nume_Facultate
      FROM Studenti S
      JOIN Departamente D ON S.ID_Departament = D.ID_Departament
      JOIN Facultate F ON D.ID_Facultate = F.ID_Facultate;
    `;

    var studentiFacultateRequest = new sql.Request();
    studentiFacultateRequest.query(studentiFacultateQuery, function (error, studentiFacultateSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareStudentiFacultate", { studentiFacultateSet: studentiFacultateSet.recordset });

      sql.close();
    });
  });
});

//interogari complexe
app.post("/afisareFacultatiCuStudenteFemei", (req, res) => {
  const selectedGender = req.body.selectedGender || 'F'; 
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var facultatiCuStudenteFemeiQuery = `
      SELECT DISTINCT F.Nume AS Nume_Facultate
      FROM Facultate F
      JOIN Departamente D ON F.ID_Facultate = D.ID_Facultate
      WHERE EXISTS (
        SELECT 1
        FROM Studenti S
        WHERE S.ID_Departament = D.ID_Departament AND S.Sex = @selectedGender
      );
    `;

    var facultatiCuStudenteFemeiRequest = new sql.Request();
    facultatiCuStudenteFemeiRequest.input('selectedGender', sql.NVarChar, selectedGender); // Parameterize the input
    facultatiCuStudenteFemeiRequest.query(facultatiCuStudenteFemeiQuery, function (error, facultatiCuStudenteFemeiSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareFacultatiCuStudenteFemei", {
        facultatiCuStudenteFemeiSet: facultatiCuStudenteFemeiSet.recordset,
        selectedGender: selectedGender,
      });

      sql.close();
    });
  });
});



app.post("/afisareSaliCuDotariMinim2", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var saliCuDotariMinim2Query = `
      SELECT S.ID_Sala, S.Numar, S.Capacitate
      FROM Sali S
      JOIN Dotari_Sali DS ON S.ID_Sala = DS.ID_Sala
      GROUP BY S.ID_Sala, S.Numar, S.Capacitate
      HAVING COUNT(DS.ID_Dotare) >= 2
        AND MAX(DS.Data_iesire) IS NULL;
    `;

    var saliCuDotariMinim2Request = new sql.Request();
    saliCuDotariMinim2Request.query(saliCuDotariMinim2Query, function (error, saliCuDotariMinim2Set) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareSaliCuDotariMinim2", { saliCuDotariMinim2Set: saliCuDotariMinim2Set.recordset });

      sql.close();
    });
  });
});


app.post("/afisareStudentiCuAceeasiDataNasterii", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var studentiCuAceeasiDataNasteriiQuery = `
      SELECT S1.ID_Student, S1.Nume, S1.Prenume, S1.Data_nasterii
      FROM Studenti S1
      WHERE EXISTS (
        SELECT 1
        FROM Studenti S2
        WHERE S2.ID_Student <> S1.ID_Student AND S2.Data_nasterii = S1.Data_nasterii
      );
    `;

    var studentiCuAceeasiDataNasteriiRequest = new sql.Request();
    studentiCuAceeasiDataNasteriiRequest.query(studentiCuAceeasiDataNasteriiQuery, function (error, studentiCuAceeasiDataNasteriiSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareStudentiCuAceeasiDataNasterii", { studentiCuAceeasiDataNasteriiSet: studentiCuAceeasiDataNasteriiSet.recordset });

      sql.close();
    });
  });
});


app.post("/afisareDepartamenteCuStudentiSiFacultatiComune", (req, res) => {
  sql.connect(config, function (error) {
    if (error) {
      console.log(error);
      res.send("Error connecting to the database");
      return;
    }

    var departamenteCuStudentiSiFacultatiComuneQuery = `
      SELECT D.Nume AS Nume_Departament
      FROM Departamente D
      WHERE (
        SELECT COUNT(*)
        FROM Studenti S
        WHERE S.ID_Departament = D.ID_Departament
      ) >= 2
      AND D.ID_Facultate IN (
        SELECT F.ID_Facultate
        FROM Facultate F
        WHERE F.Adresa IN (
          SELECT Adresa
          FROM Facultate
          GROUP BY Adresa
          HAVING COUNT(*) >= 2
        )
      );
    `;

    var departamenteCuStudentiSiFacultatiComuneRequest = new sql.Request();
    departamenteCuStudentiSiFacultatiComuneRequest.query(departamenteCuStudentiSiFacultatiComuneQuery, function (error, departamenteCuStudentiSiFacultatiComuneSet) {
      if (error) {
        console.log(error);
        res.send("Error querying the database");
        sql.close();
        return;
      }

      res.render("afisareDepartamenteCuStudentiSiFacultatiComune", { departamenteCuStudentiSiFacultatiComuneSet: departamenteCuStudentiSiFacultatiComuneSet.recordset });

      sql.close();
    });
  });
});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});