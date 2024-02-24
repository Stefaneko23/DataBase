CREATE TABLE Facultate (
    ID_Facultate INT PRIMARY KEY,
    Nume NVARCHAR(255),
    Adresa NVARCHAR(255),
    Numar_telefon NVARCHAR(11)
);

CREATE TABLE Departamente (
    ID_Departament INT PRIMARY KEY,
    Nume NVARCHAR(255),
    Cod_Departament NVARCHAR(20),
    Decan NVARCHAR(255),
    ID_Facultate INT,
    FOREIGN KEY (ID_Facultate) REFERENCES Facultate(ID_Facultate)
);

CREATE TABLE Studenti (
    ID_Student INT PRIMARY KEY,
    Nume NVARCHAR(255),
    Prenume NVARCHAR(255),
    CNP NVARCHAR(13) ,
    Email NVARCHAR(255),
    Sex CHAR(1),
    Data_nasterii DATE,
    ID_Departament INT,
    FOREIGN KEY (ID_Departament) REFERENCES Departamente(ID_Departament)
);

CREATE TABLE Sali (
    ID_Sala INT PRIMARY KEY,
    Numar INT,
    Capacitate INT
);

CREATE TABLE Dotari (
    ID_Dotare INT PRIMARY KEY,
    Nume VARCHAR(255),
    Descriere TEXT,
    Stoc_disponibil INT
);

CREATE TABLE Dotari_Sali (
    ID_Sala INT,
    ID_Dotare INT,
    Data_intrare DATE,
    Data_iesire DATE,
    PRIMARY KEY (ID_Sala, ID_Dotare),
    FOREIGN KEY (ID_Sala) REFERENCES Sali(ID_Sala),
    FOREIGN KEY (ID_Dotare) REFERENCES Dotari(ID_Dotare)
);

ALTER TABLE Studenti
ADD CONSTRAINT CHK_EmailFormat
CHECK (LOWER(Email) = CONCAT(Nume, '.', Prenume, '@yahoo.com'));

-- Adăugați constrângerea pentru Data_intrare
ALTER TABLE Dotari_Sali
ADD CONSTRAINT CHK_DataIntrareFormat CHECK (CONVERT(VARCHAR, Data_intrare, 23) = CONVERT(VARCHAR, Data_intrare, 126));

-- Adăugați constrângerea pentru Data_iesire
ALTER TABLE Dotari_Sali
ADD CONSTRAINT CHK_DataIesireFormat CHECK (CONVERT(VARCHAR, Data_iesire, 23) = CONVERT(VARCHAR, Data_iesire, 126));

ALTER TABLE Studenti
ADD CONSTRAINT CHK_Data_nasteriiPattern CHECK (
    CONVERT(VARCHAR, Data_nasterii, 23) = CONVERT(VARCHAR, Data_nasterii, 126) AND
    YEAR(Data_nasterii) < 2023 AND
    DATEDIFF(YEAR, Data_nasterii, GETDATE()) >= 18
);

ALTER TABLE Studenti
ADD CONSTRAINT CHK_DataNasteriiPattern CHECK (CONVERT(VARCHAR, Data_nasterii, 23) = CONVERT(VARCHAR, Data_nasterii, 126));


-- Populați tabela "Facultate" cu exemple de date
INSERT INTO Facultate (ID_Facultate, Nume, Adresa, Numar_telefon)
VALUES
	(1, 'Facultatea de Automatica si Calculatoare', 'Strada Independentei 313', '0223456789');
    (2, 'Facultatea de Energetica', 'Splaiul Independenței 313', ' 0214029322'),
    (3, 'Facultatea de Transporturi', 'Splaiul Independenței 313', '0214029568'),
    (4, 'Facultatea de Inginerie Medicala', 'Strada Gheorghe Polizu 1-7', '0214029039'),
    (5, 'Facultatea de Mecatronica', ' Splaiul Independenței 313', '0214029301'),
    (6, 'Facultatea de Inginerie Aerospatiala', 'Strada Gheorghe Polizu 1', '0214023812'),
    (7, 'Facultatea de Inginerie Chimică și Biotehnologii', 'Strada Gheorghe Polizu 1-7', '0214023927');

	-- Populați tabela "Departamente" cu exemple de date
INSERT INTO Departamente (ID_Departament, Nume, Cod_Departament, Decan, ID_Facultate)
VALUES
    (11, 'Informatica Aplicata', 'INFO', 'Prof. Dr. Mocanu', 1),
    (22, 'Sisteme Electroenergetice', 'ELECTROENERGIE', 'Prof. Dr. Drujescu', 2),
    (33, 'Autovehicule Rutiere', 'AUTO RUTIERE', 'Prof. Dr. Popovici', 3),
    (44, 'Bioinginerie si Biotehnologie', 'DBB', 'Prof. Dr. Galateanu', 4),
    (55, 'Mecatronica si Robotica', 'DMR', 'Prof. Dr. Voiculescu', 5),
    (66, 'Inginerie si management aeronautic', 'AIR', 'Prof. Dr. Nita', 6),
    (77, 'Bioresurse si Stiinta Polimerilor', 'DBSP', 'Prof. Dr. Heisenberg', 7);

	-- Adăugarea unor date de exemplu în tabela Studenti
INSERT INTO Studenti (ID_Student,Nume, Prenume, CNP, Email, Sex, Data_nasterii, ID_Departament)
VALUES
    (0026,'Popescu', 'Ion', '5960315170026', 'popescu.ion@yahoo.com', 'M', '1995-03-15', 11),
    (0022,'Ionescu', 'Ana', '6940822130022', 'ionescu.ana@yahoo.com', 'F', '1994-08-22', 22),
    (0011,'Radulescu', 'Mihai', '5961106160011', 'radulescu.mihai@yahoo.com', 'M', '1996-11-05', 33),
    (0143,'Dumitru', 'Elena', '6930610220143', 'dumitru.elena@yahoo.com', 'F', '1993-06-10', 44),
    (3218,'Balan', 'Alexandru', '5970125003218', 'balan.alexandru@yahoo.com', 'M', '1997-01-25', 55),
    (8415,'Georgescu', 'Cristina', '6920418038415', 'georgescu.cristina@yahoo.com', 'F', '1992-04-18', 66),
    (1459,'Constantin', 'Andrei', '5980930041459', 'constantin.andrei@yahoo.com', 'M', '1998-09-30', 77),
    (1506,'Marinescu', 'Mihaela', '6911212031506', 'marinescu.mihaela@yahoo.com', 'F', '1991-12-12', 22),
    (2815,'Pintilie', 'Darius', '5990708952815', 'pintilie.darius@yahoo.com', 'M', '1999-07-08', 33);


	-- Adăugarea de date de exemplu în tabela Sali
INSERT INTO Sali (ID_Sala, Numar, Capacitate)
VALUES
    (12, 101, 204),
    (23, 102, 31),
    (34, 103, 87),
    (45, 201, 14),
    (56, 202, 52),
    (67, 203, 154),
    (78, 301, 305),
    (89, 302, 98),
    (90, 303, 120);

	-- Adăugarea de date de exemplu în tabela Dotari
INSERT INTO Dotari (ID_Dotare, Nume, Descriere, Stoc_disponibil)
VALUES
    (101, 'Proiectoare', 'Proiectoare pentru prezentari', 41),
    (102, 'Calculatoare', 'Calculatoare pentru laboratoare', 20),
    (103, 'Microscoape', 'Microscoape pentru laboratoarele de biologie', 15),
    (104, 'Tablă interactivă', 'Tablă interactivă pentru sălile de curs', 5),
    (105, 'Kituri de chimie', 'Kituri de chimie pentru laboratoare', 12),
    (106, 'Mese de laborator', 'Mese speciale pentru laboratoare', 23),
    (107, 'Televizoare', 'Televizoare pentru sălile de conferințe', 41),
    (108, 'Imprimante', 'Imprimante pentru birouri', 15),
    (109, 'Sisteme audio', 'Sisteme audio pentru sălile de curs', 10),
    (110, 'Laptopuri', 'Laptopuri pentru activități mobile', 18),
    (111, 'Kituri de electronica', 'Kituri de electronica cu cabluri pentru laboratoare', 34),
    (112, 'Sisteme de securitate', 'Camere video pentru laboratoare', 9);

	-- Adăugarea de date de exemplu în tabela Dotari_Sali
INSERT INTO Dotari_Sali (ID_Sala, ID_Dotare, Data_intrare, Data_iesire)
VALUES
    (12, 101, '2014-01-01', ' '),
    (23, 102, '2009-01-02', '2017-01-06'),
    (34, 110, '2017-01-07', ' '),
    (45, 103, '2012-01-04', ' '),
    (56, 104, '2022-01-05', ' '),
    (67, 105, '2011-01-06', ' '),
    (78, 106, '2018-01-07', ' '),
    (89, 107, '2018-01-08', ' '),
    (90, 108, '2015-01-09', ' '),
    (45, 109, '2006-01-10', '2022-01-14'),
    (23, 111, '2021-01-11', '2023-01-15'),
    (34, 112, '2022-08-23', ' ');
