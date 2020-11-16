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

-- GRAU
CREATE TABLE inovacnj.grau_jurisdicao
(   cod character varying(5) NOT NULL,
    descricao character varying(50)  NOT NULL,
    CONSTRAINT pk_grauj PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.grau_jurisdicao
    OWNER to inovacnj;

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

-- TRIBUNAL
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

CREATE TABLE inovacnj.fat_movimentos_te
(
    codtribunal text ,
    grau text ,
    millisinsercao bigint,
    codclasse bigint,
    descclasse text ,
    codlocalidade text ,
    competencia text ,
    dtajuizamento timestamp without time zone,
    descsistema text,
    nivelsigilo bigint,
    npu text ,
    oj_codibge bigint,
    oj_cod text ,
    oj_instancia text ,
    oj_descricao text ,
    tramitacao bigint,
    tamanhoprocesso text ,
    valorcausa text ,
    ass_cod bigint,
    descassunto text ,
    ass_principal boolean,
    ass_codlocal bigint,
    ass_codpainacional bigint,
    ass_desclocal text ,
    mov_dtmov timestamp without time zone,
    mov_codlocal bigint,
    mov_codpainacional bigint,
    mov_cod bigint,
    descmovimento text ,
    mov_nivelsigilo text ,
    mov_oj_codibge bigint,
    mov_oj_cod text ,
    mov_oj_instancia text ,
    mov_oj_descricao text ,
    mov_tpdecisao text ,
    mov_tprespmov text ,
    natureza text ,
    fase text );

ALTER TABLE inovacnj.fat_movimentos_te
    OWNER to inovacnj;
                                    
