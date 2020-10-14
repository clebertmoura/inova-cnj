-- CRIA A BASE DE DADOS DO METABASE
CREATE DATABASE dbmetabase;
CREATE USER metabase WITH PASSWORD 'metabase@admin';
GRANT ALL PRIVILEGES ON DATABASE dbmetabase TO metabase;


-- BASE DE DADOS INOVA CNJ

CREATE SCHEMA inovacnj
    AUTHORIZATION inovacnj;

-- CLASSE    
CREATE TABLE inovacnj.classe
(   cod numeric NOT NULL,
    descricao character varying(200),
    sigla character varying(20),
    codpai numeric,
    natureza character varying(10),
    CONSTRAINT pk_classe PRIMARY KEY (cod)
);

-- ASSUNTO


-- ORGAO_JULGADOR

-- PROCESSO

-- PROCESSOASSUNTO

-- MOVIMENTO
