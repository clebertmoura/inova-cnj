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

ALTER TABLE inovacnj.classe
  OWNER to inovacnj;

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

-- FASE
CREATE TABLE inovacnj.fase
(cod numeric NOT NULL,
 descricao character varying(200) NOT NULL,
 codpai numeric,
 CONSTRAINT pk_fase PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.fase
  OWNER to inovacnj;
    
-- PROCESSO
CREATE TABLE inovacnj.processo
(npu character varying(20),
 dtajuizamento timestamp,
 codtribunal character varying(4) , 
 codoj character varying(4),
 grau character varying (4),
 codassunto numeric,
 assunto_principal boolean,
 codclasse numeric, 
 tramitacao character varying(1),  --dadosBasicos.procEl: Tramitação - 1: Sistema Eletrônico - 2: Sistema Físico;
CONSTRAINT pk_processo PRIMARY KEY (npu));

ALTER TABLE inovacnj.processo
    OWNER to inovacnj;
    
-- ESFERA_JUSTICA
CREATE TABLE inovacnj.esfera_justica
(   cod character varying(1) NOT NULL,
    descricao character varying(50) NOT NULL,
    CONSTRAINT pk_ejust PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.esfera_justica
    OWNER to inovacnj;

-- TRIBUNAL
CREATE TABLE inovacnj.tribunal
(   cod character varying(4) NOT NULL,
    descricao character varying(50) NOT NULL,
    CONSTRAINT pk_tribunal PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.tribunal
    OWNER to inovacnj;

-- TEMPO

-- MOVIMENTO
CREATE TABLE inovacnj.movimento
(
    npu character varying(20) NOT NULL,
    codmov numeric,
    dtmov timestamp with time zone,
    CONSTRAINT pk_movim PRIMARY KEY (npu, codmov, dtmov)
);

ALTER TABLE inovacnj.movimento
    OWNER to inovacnj;
                                    
                                    
