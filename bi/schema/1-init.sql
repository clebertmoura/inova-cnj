-- CRIA A BASE DE DADOS DO METABASE
CREATE DATABASE dbmetabase;
CREATE USER metabase WITH PASSWORD 'metabase@admin';
GRANT ALL PRIVILEGES ON DATABASE dbmetabase TO metabase;

-- BASE DE DADOS INOVA CNJ

CREATE SCHEMA inovacnj
    AUTHORIZATION inovacnj;

-- Table: inovacnj.CLASSE    
CREATE TABLE inovacnj.classe
(   cod integer NOT NULL,
    descricao text ,
    sigla text ,
    codpai double precision,
    CONSTRAINT pk_classe PRIMARY KEY (cod)
);

COMMENT ON COLUMN inovacnj.classe.cod  IS 'Código identificador único da classe processual.';
COMMENT ON COLUMN inovacnj.classe.descricao IS 'Descrição da classe processual.';
COMMENT ON COLUMN inovacnj.classe.sigla IS 'Sigla da classe processual.';
COMMENT ON COLUMN inovacnj.classe.codpai IS 'Código identificador da classe processual pai.';
ALTER TABLE inovacnj.classe OWNER to inovacnj;

-- Table: inovacnj.ASSUNTO
CREATE TABLE inovacnj.assunto
(   cod integer NOT NULL,
    descricao text ,
    codpai double precision,
    CONSTRAINT pk_assunto PRIMARY KEY (cod)
 );

COMMENT ON COLUMN inovacnj.assunto.cod  IS 'Código identificador único assunto processual.';
COMMENT ON COLUMN inovacnj.assunto.descricao  IS 'Descrição do assunto processual.';
COMMENT ON COLUMN inovacnj.assunto.codpai  IS 'Código identificador da assunto processual pai.';
ALTER TABLE inovacnj.assunto OWNER to inovacnj;

-- Table: inovacnj.NATUREZA
CREATE TABLE inovacnj.natureza
(   cod integer NOT NULL,
    descricao text,
    CONSTRAINT pk_natureza PRIMARY KEY (cod)
);

COMMENT ON COLUMN inovacnj.natureza.cod IS 'Chave primária da tabela.';
COMMENT ON COLUMN inovacnj.natureza.descricao IS 'Descrição da natureza. Valores: Cível, família, execução fiscal, eleitoral, etc.';
ALTER TABLE inovacnj.natureza OWNER to inovacnj;

-- Table: inovacnj.NATUREZA_CLASSE
CREATE TABLE inovacnj.natureza_classe
(   cod_classe integer NOT NULL,
    cod_natureza integer NOT NULL,
    CONSTRAINT pk_natureza_classe PRIMARY KEY (cod_classe, cod_natureza)
);

COMMENT ON COLUMN inovacnj.natureza_classe.cod_classe IS 'Chave primária e estrangeira para a tabela Classe.';
COMMENT ON COLUMN inovacnj.natureza_classe.cod_natureza IS 'Chave primária e estrangeira para a tabela Natureza.';
ALTER TABLE inovacnj.natureza_classe  OWNER to inovacnj;

-- Table: inovacnj.GRAU_JURISDICAO
CREATE TABLE inovacnj.grau_jurisdicao
(   cod text  NOT NULL,
    descricao text  NOT NULL,
    tipo text NOT NULL,
    CONSTRAINT pk_graujur PRIMARY KEY (cod, tipo)
);

COMMENT ON COLUMN inovacnj.grau_jurisdicao.cod  IS 'Chave primária da tabela.';
COMMENT ON COLUMN inovacnj.grau_jurisdicao.descricao IS 'Jurisdição do processo. Valores: SUP - Tribunal Superior, G2 - 2º Grau, TR - Turma Recursal, G1 - 1º grau, JE- Juizados Especiais, TRU - Turma Regional de Uniformização, TNU - Turma Nacional de Uniformização, TEU - Turma Estadual de Uniformização, CJF - Conselho da Justiça Federal, CSJT - Conselho Superior da Justiça do Trabalho.';
COMMENT ON COLUMN inovacnj.grau_jurisdicao.tipo IS 'Tipo da Justiça. Valores: Estadual, Federal, Militar, Eleitoral, Trabalho.';
ALTER TABLE inovacnj.grau_jurisdicao OWNER to inovacnj;

-- Table: inovacnj.fase
CREATE TABLE inovacnj.fase
(   cod integer NOT NULL,
    descricao text ,
    cod_tribunal text ,
    CONSTRAINT pk_fase PRIMARY KEY (cod)
);

COMMENT ON COLUMN inovacnj.fase.cod IS 'Chave primária da tabela, controlada pela sequence SEQ_FASE, específica pra ela.';
COMMENT ON COLUMN inovacnj.fase.descricao IS 'Descrição da fase.';
COMMENT ON COLUMN inovacnj.fase.cod_tribunal IS 'Código do tribunal.';
ALTER TABLE inovacnj.fase  OWNER to inovacnj;

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

-- Table: inovacnj.TRIBUNAL
CREATE TABLE inovacnj.tribunal
(   cod character varying(5)  NOT NULL,
    descricao character varying(100) NOT NULL,
    sigla character varying(5)  NOT NULL ,
    tipo character varying(20)  NOT NULL,
    porte character varying(10) NOT NULL,
    latitude real ,
    longitude real ,
    coduf numeric NOT NULL,
    uf character varying(2) NOT NULL,
    tipotribunal_oj character varying(10) NOT NULL,
    CONSTRAINT pk_tribunal PRIMARY KEY (cod)
);	

COMMENT ON COLUMN inovacnj.tribunal.cod IS 'Chave primária da tabela.';
COMMENT ON COLUMN inovacnj.tribunal.descricao IS 'Nome do tribunal.';
COMMENT ON COLUMN inovacnj.tribunal.sigla IS 'Sigla do tribunal. Valores: TJAC, TRF1, TST, STJ, etc.';
COMMENT ON COLUMN inovacnj.tribunal.tipo IS 'Tipo da Justiça. Valores: Estadual, Eleitoral, Federal, Militar, Superior, Trabalho.';
COMMENT ON COLUMN inovacnj.tribunal.porte IS 'Classificação do porte do tribunal, conforme classificação do CNJ, disponível no relatório do Justiça em Números 2020, a partir da página 42. Valores: Pequeno, Médio, Grande.';
COMMENT ON COLUMN inovacnj.tribunal.latitude  IS 'Latitude de um determinado ponto da UF em que se encontra o tribunal.';
COMMENT ON COLUMN inovacnj.tribunal.longitude IS 'Longitude de um determinado ponto da UF em que se encontra o tribunal.';
COMMENT ON COLUMN inovacnj.tribunal.coduf IS 'Código da UF conforme codificação adotada pelo IBGE, disponível em www.ibge.gov.br/explica/codigos-dos-municipios.php.';
COMMENT ON COLUMN inovacnj.tribunal.uf IS 'Sigla do estado da federação brasileira. Valores: AL, BA, SP , DF, AC, etc.';
COMMENT ON COLUMN inovacnj.tribunal.tipotribunal_oj IS 'Sigla do tribunal, campo TIP_ORGAO, definido no csv mpm_serventias.';
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

-- FATOS

                                    
-- SEQUENCE: inovacnj.seq_fase
-- DROP SEQUENCE inovacnj.seq_fase;

CREATE SEQUENCE inovacnj.seq_fase1
    INCREMENT 1
    START 5;

ALTER SEQUENCE inovacnj.seq_fase
    OWNER TO inovacnj;
