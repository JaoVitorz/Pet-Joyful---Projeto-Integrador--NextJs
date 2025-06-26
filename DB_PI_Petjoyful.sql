
CREATE DATABASE DB_PI_Petjoyful;
GO

USE DB_PI_PetJoyful;
GO

-- 1.
CREATE TABLE Usuario (
    ID_usuario INT IDENTITY PRIMARY KEY,
    Senha VARCHAR(100),
    Data_Cadastro DATETIME,
    Nome VARCHAR(80),
    Sobre VARCHAR(200),
    Email VARCHAR(80),
    CPF VARCHAR(11),
    Foto_Perfil VARCHAR(200)
);

-- 2.
CREATE TABLE ONG (
    ID_ONG INT IDENTITY PRIMARY KEY,
    CNPJ CHAR(14),
    Contato VARCHAR(100),
    FK_Usuario_ID_usuario INT,
    FOREIGN KEY (FK_Usuario_ID_usuario) REFERENCES Usuario(ID_usuario)
);

-- 3.
CREATE TABLE VETERINARIO (
    ID_Veterinario INT IDENTITY PRIMARY KEY,
    CRMV VARCHAR(20),
    FK_Usuario_ID_usuario INT,
    FOREIGN KEY (FK_Usuario_ID_usuario) REFERENCES Usuario(ID_usuario)
);

-- 4.
CREATE TABLE Formulario_Adocao (
    ID_Form INT IDENTITY PRIMARY KEY,
    URL VARCHAR(100),
    fk_ONG_ID_ONG INT,
    fk_ONG_FK_Usuario_ID_usuario INT,
    FOREIGN KEY (fk_ONG_ID_ONG) REFERENCES ONG(ID_ONG),
    FOREIGN KEY (fk_ONG_FK_Usuario_ID_usuario) REFERENCES Usuario(ID_usuario)
);

-- 5.
CREATE TABLE Chat (
    ID_Conversa INT IDENTITY PRIMARY KEY,
    Data_Inicio DATETIME
);

-- 6.
CREATE TABLE Mensagem (
    ID_Msg INT IDENTITY PRIMARY KEY,
    Data_Msg DATETIME,
    Conteudo VARCHAR(200)
);

-- 7.
CREATE TABLE Chat_Mensagem (
    fk_Chat_ID_Conversa INT,
    fk_Mensagem_ID_Msg INT,
    ID_Chat_Msg INT PRIMARY KEY,
    FOREIGN KEY (fk_Chat_ID_Conversa) REFERENCES Chat(ID_Conversa),
    FOREIGN KEY (fk_Mensagem_ID_Msg) REFERENCES Mensagem(ID_Msg)
);

-- 8.
CREATE TABLE Mensagem_Usuario (
    fk_Usuario_ID_usuario INT,
    fk_Mensagem_ID_Msg INT,
    ID_Msg_Usuario INT PRIMARY KEY,
    FOREIGN KEY (fk_Usuario_ID_usuario) REFERENCES Usuario(ID_usuario),
    FOREIGN KEY (fk_Mensagem_ID_Msg) REFERENCES Mensagem(ID_Msg)
);

-- 9.
CREATE TABLE Postagem (
    ID_Post INT IDENTITY PRIMARY KEY,
    Data_Post DATETIME,
    Conteudo VARCHAR(200),
    fk_Usuario_ID_usuario INT,
    FOREIGN KEY (fk_Usuario_ID_usuario) REFERENCES Usuario(ID_usuario)
);

-- 10.
CREATE TABLE Comentario_Comenta (
    ID_Comentario INT IDENTITY PRIMARY KEY,
    DataComentario DATETIME,
    Comentario VARCHAR(200),
    fk_Usuario_ID_usuario INT,
    fk_Postagem_ID_Post INT,
    FOREIGN KEY (fk_Usuario_ID_usuario) REFERENCES Usuario(ID_usuario),
    FOREIGN KEY (fk_Postagem_ID_Post) REFERENCES Postagem(ID_Post)
);

-- 11.
CREATE TABLE Curtidas_Curte (
    ID_Curtida INT IDENTITY PRIMARY KEY,
    fk_Postagem_ID_Post INT,
    fk_Usuario_ID_usuario INT,
    FOREIGN KEY (fk_Postagem_ID_Post) REFERENCES Postagem(ID_Post),
    FOREIGN KEY (fk_Usuario_ID_usuario) REFERENCES Usuario(ID_usuario)
);

-- 12.
CREATE TABLE Denuncia_Denuncia (
    ID_Denuncia INT IDENTITY PRIMARY KEY,
    Conteudo VARCHAR(100),
    fk_Postagem_ID_Post INT,
    fk_Usuario_ID_usuario INT,
    FOREIGN KEY (fk_Postagem_ID_Post) REFERENCES Postagem(ID_Post),
    FOREIGN KEY (fk_Usuario_ID_usuario) REFERENCES Usuario(ID_usuario)
);

INSERT INTO Usuario (Senha, Data_Cadastro, Nome, Sobre, Email, CPF, Foto_Perfil)
VALUES ('senha123', GETDATE(), 'João Silva', 'Amante de pets.', 'joao@email.com', '12345678901', 'joao.jpg');

INSERT INTO ONG (CNPJ, Contato, FK_Usuario_ID_usuario)
VALUES ('12345678000199', 'contato@ongpets.com', 1);

INSERT INTO VETERINARIO (CRMV, FK_Usuario_ID_usuario)
VALUES ('SP12345', 1);

INSERT INTO Formulario_Adocao (URL, fk_ONG_ID_ONG, fk_ONG_FK_Usuario_ID_usuario)
VALUES ('www.ongpets.com/form/adocao1', 1, 1);

INSERT INTO Chat (Data_Inicio)
VALUES (GETDATE());

INSERT INTO Mensagem (Data_Msg, Conteudo)
VALUES (GETDATE(), 'Olá, gostaria de informações.');

INSERT INTO Chat_Mensagem (fk_Chat_ID_Conversa, fk_Mensagem_ID_Msg, ID_Chat_Msg)
VALUES (1, 1, 1);

INSERT INTO Mensagem_Usuario (fk_Usuario_ID_usuario, fk_Mensagem_ID_Msg, ID_Msg_Usuario)
VALUES (1, 1, 1);

INSERT INTO Postagem (Data_Post, Conteudo, fk_Usuario_ID_usuario)
VALUES (GETDATE(), 'Adote um amigo!', 1);

INSERT INTO Comentario_Comenta (DataComentario, Comentario, fk_Usuario_ID_usuario, fk_Postagem_ID_Post)
VALUES (GETDATE(), 'Que postagem linda!', 1, 1);

INSERT INTO Curtidas_Curte (fk_Postagem_ID_Post, fk_Usuario_ID_usuario)
VALUES (1, 1);

INSERT INTO Denuncia_Denuncia (Conteudo, fk_Postagem_ID_Post, fk_Usuario_ID_usuario)
VALUES ('Conteúdo impróprio', 1, 1);
