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
CREATE TABLE inovacnj.assunto
(   cod numeric NOT NULL,
    descricao character varying(400) NOT NULL,
    codpai numeric,
    CONSTRAINT pk_assunto PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.assunto
    OWNER to inovacnj;

-- ORGAO_JULGADOR
CREATE TABLE inovacnj.orgao_julgador
(
    cod numeric NOT NULL,
    descricao character varying(200) NOT NULL,
    codpai numeric,
    sigla_tipoj character varying(5) ,
    tipo_oj character varying(100) ,
    cidade character varying(100) ,
    uf character varying(2) ,
    codibge character varying(15),
    esfera character varying(1) ,
    CONSTRAINT pk_ojulg PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.orgao_julgador
    OWNER to inovacnj;

-- MOVIMENTO
CREATE TABLE inovacnj.movimento
(   cod numeric NOT NULL,
    descricao character varying(200) NOT NULL,
    codpai numeric,
    CONSTRAINT pk_movimento PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.movimento
    OWNER to inovacnj;
    
-- PROCESSO

    
