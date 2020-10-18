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
(
	cod numeric NOT NULL,
	descricao character varying(400) NOT NULL,
    codpai numeric,
	CONSTRAINT pk_assunto PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.assunto OWNER to inovacnj;

-- MOVIMENTOCNJ
CREATE TABLE inovacnj.movimentocnj 
(   cod numeric NOT NULL,
    descricao character varying(400) NOT NULL,
    natureza character varying(100) NOT NULL,
    fase character varying(100),
    codpai numeric,
	CONSTRAINT pk_movimentocnj PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.movimentocnj OWNER to inovacnj;

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

ALTER TABLE inovacnj.orgao_julgador OWNER to inovacnj;

-- FASE
CREATE TABLE inovacnj.fase
(
	cod numeric NOT NULL,
	descricao character varying(200) NOT NULL,
	codpai numeric,
	CONSTRAINT pk_fase PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.fase OWNER to inovacnj;
    
-- PROCESSO
CREATE TABLE inovacnj.processo
(
	npu character varying(20),
	dtajuizamento timestamp,
	codtribunal character varying(10) , 
	codoj character varying(4),
	grau character varying (4),
	codassunto numeric,
	assunto_principal boolean,
	codclasse numeric, 
	tramitacao character varying(1),  --dadosBasicos.procEl: Tramitação - 1: Sistema Eletrônico - 2: Sistema Físico;
	CONSTRAINT pk_processo PRIMARY KEY (npu)
);

ALTER TABLE inovacnj.processo OWNER to inovacnj;
    
-- ESFERA_JUSTICA
CREATE TABLE inovacnj.esfera_justica
(
	cod character varying(1) NOT NULL,
	descricao character varying(50) NOT NULL,
	CONSTRAINT pk_ejust PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.esfera_justica OWNER to inovacnj;

-- TRIBUNAL
CREATE TABLE inovacnj.tribunal
(   cod character varying(5)  NOT NULL,
    descricao character varying(100) NOT NULL,
    sigla character varying(5) ,
    tipo character varying(20) ,
    porte character varying(10) ,
    CONSTRAINT pk_tribunal PRIMARY KEY (cod)
);	

ALTER TABLE inovacnj.tribunal OWNER to inovacnj;

-- TEMPO
CREATE TABLE inovacnj.tempo
(data date,
nu_ano  numeric,
nu_dia numeric,
nu_semestre numeric,
ds_semestre character varying(10), 
ds_codanosemestre numeric,
ds_semestreano character varying(10) ,
nu_trimestre numeric,
ds_trimestre character varying(10) ,
nu_codanotrimestre numeric,
ds_trimestreano character varying(10) ,
nu_mes numeric,
ds_mes character varying(10),
sigla_mes character varying(10),
nu_anomes numeric,
ds_anomes character varying(10),
nu_diasemana numeric,
ds_diasemana character varying(10) ,
ds_siglasemana character varying(10),
CONSTRAINT pk_tempo PRIMARY KEY(data)
 );

ALTER TABLE inovacnj.tempo OWNER to inovacnj;

-- MOVIMENTO
CREATE TABLE inovacnj.movimento
(
	npu character varying(20) NOT NULL,
	codmov numeric,
	dtmov timestamp with time zone,
	CONSTRAINT pk_movim PRIMARY KEY (npu, codmov, dtmov)
);

ALTER TABLE inovacnj.movimento OWNER to inovacnj;
                                    
                                    
