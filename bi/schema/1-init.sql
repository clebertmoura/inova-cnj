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

-- Table: inovacnj.FASE
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

-- Table: inovacnj.MOVIMENTOCNJ

CREATE TABLE inovacnj.movimentocnj
(
    cod integer NOT NULL,
    descricao text COLLATE pg_catalog."default",
    natureza text COLLATE pg_catalog."default",
    fase text COLLATE pg_catalog."default",
    codpai double precision,
    CONSTRAINT pk_movimentocnj PRIMARY KEY (cod)
);

COMMENT ON COLUMN inovacnj.movimentocnj.cod  IS 'Código identificador único da movimentação processual.';
COMMENT ON COLUMN inovacnj.movimentocnj.descricao IS 'Descrição da Movimentação Processual.';
COMMENT ON COLUMN inovacnj.movimentocnj.codpai IS 'Código identificador da Movimentação Processual pai.';
ALTER TABLE inovacnj.movimentocnj  OWNER to inovacnj;

-- Table: inovacnj.fase_movimento
CREATE TABLE inovacnj.fase_movimento
(
    cod_movimento integer NOT NULL,
    cod_fase integer NOT NULL,
    fase text ,
    CONSTRAINT pk_fasemov PRIMARY KEY (cod_movimento, cod_fase),
    CONSTRAINT fk_fasemov_fase FOREIGN KEY (cod_fase)
        REFERENCES inovacnj.fase (cod) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_fasemov_movimento FOREIGN KEY (cod_movimento)
        REFERENCES inovacnj.movimentocnj (cod) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

COMMENT ON COLUMN inovacnj.fase_movimento.cod_movimento IS 'Código do movimento.';
COMMENT ON COLUMN inovacnj.fase_movimento.cod_fase  IS 'Código da fase.';
ALTER TABLE inovacnj.fase_movimento OWNER to inovacnj;

-- Table: inovacnj.ORGAO_JULGADOR
CREATE TABLE inovacnj.orgao_julgador
(
    cod integer,
    descricao character varying(200) NOT NULL,
    ordem integer,
    codpai integer,
    codtribunal character varying(10),
    atuacao_vara character varying(30),
    sigla_tipoj character varying(5),
    tipo_oj character varying(100),
    cidade character varying(100),
    uf character varying(2),
    codibge integer,
    esfera character varying(1),
    latitude real,
    longitude real
    CONSTRAINT pk_ojulg PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.orgao_julgador OWNER to inovacnj;
    
-- Table: inovacnj.PROCESSO_ASSUNTO
CREATE TABLE inovacnj.processo_assunto
(
    codtribunal text ,
    npu text ,
    dtajuizamento timestamp without time zone,
    codclasse bigint,
    descclasse text ,
    codassunto bigint NOT NULL,
    descassunto text,
    assunto_principal boolean,
    codassunto_local bigint NOT NULL,
    descassunto_local ,
    codassunto_pai bigint NOT NULL
);

ALTER TABLE inovacnj.processo_assunto OWNER to inovacnj;

CREATE INDEX ix_prc_ass_codass
    ON inovacnj.processo_assunto USING btree
    (codassunto ASC NULLS LAST)
    TABLESPACE pg_default;
    
CREATE INDEX ix_prc_ass_codtrib
    ON inovacnj.processo_assunto USING btree
    (codtribunal ASC NULLS LAST)
    TABLESPACE pg_default;    

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

-- Table: inovacnj.PIB_MUNICIPIO
CREATE TABLE inovacnj.pib_municipio
(   codmunicipio numeric NOT NULL,
    porte character varying(20) ,
    pib numeric,
    pib_percapita numeric,
    pop_estimada numeric,
    reg_metropolitana character varying(1)  NOT NULL,
    desc_pibpercapita character varying(50) ,
    CONSTRAINT pk_pib_municipio PRIMARY KEY (codmunicipio)
);

ALTER TABLE inovacnj.pib_municipio  OWNER to inovacnj;

-- FATOS
-- Table: inovacnj.fat_movimento_jele
CREATE TABLE inovacnj.fat_movimento_jele
(   codtribunal text ,
    grau text ,
    millisinsercao bigint,
    codclasse bigint,
    descclasse text ,
    codlocalidade text ,
    competencia text NOT NULL,
    dtajuizamento timestamp without time zone,
    descsistema text ,
    nivelsigilo bigint,
    npu text ,
    valorcausa text ,
    tramitacao bigint,
    tamanhoprocesso text,
    oj_codibge bigint,
    oj_cod text ,
    oj_instancia text ,
    oj_descricao text ,
    mov_dtmov timestamp without time zone,
    mov_cod bigint,
    descmovimento text ,
    mov_codlocal bigint,
    mov_codpainacional bigint,
    mov_nivelsigilo text ,
    mov_oj_codibge bigint,
    mov_oj_cod text ,
    mov_oj_instancia text ,
    mov_oj_descricao text ,
    mov_tpdecisao text NOT NULL,
    mov_tprespmov text NOT NULL
);

ALTER TABLE inovacnj.fat_movimento_jele OWNER to inovacnj;

CREATE INDEX ix_fatjele_npu
    ON inovacnj.fat_movimento_jele USING btree
    (npu ASC NULLS LAST, mov_dtmov ASC NULLS LAST, mov_cod ASC NULLS LAST)
    TABLESPACE pg_default;
 
 -- Table: inovacnj.fat_movimento_jest
CREATE TABLE inovacnj.fat_movimento_jest
(   codtribunal text ,
    grau text ,
    millisinsercao bigint,
    codclasse bigint,
    descclasse text ,
    codlocalidade text ,
    competencia text NOT NULL,
    dtajuizamento timestamp without time zone,
    descsistema text ,
    nivelsigilo bigint,
    npu text ,
    valorcausa text ,
    tramitacao bigint,
    tamanhoprocesso text ,
    oj_codibge bigint,
    oj_cod text ,
    oj_instancia text ,
    oj_descricao text ,
    mov_dtmov timestamp without time zone,
    mov_cod bigint,
    descmovimento text ,
    mov_codlocal bigint,
    mov_codpainacional bigint,
    mov_nivelsigilo text ,
    mov_oj_codibge bigint,
    mov_oj_cod text ,
    mov_oj_instancia text ,
    mov_oj_descricao text ,
    mov_tpdecisao text  NOT NULL,
    mov_tprespmov text  NOT NULL,
    cod_oj bigint
);

ALTER TABLE inovacnj.fat_movimento_jest  OWNER to inovacnj;

-- Index: ix_codtribunal
CREATE INDEX ix_codtribunal
    ON inovacnj.fat_movimento_jest USING btree
    (codtribunal  DESC NULLS LAST)
    TABLESPACE pg_default;

-- Index: ix_dtmov_npu
CREATE INDEX ix_dtmov_npu
    ON inovacnj.fat_movimento_jest USING btree
    (npu  ASC NULLS LAST, mov_dtmov ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: ix_npu
CREATE INDEX ix_npu
    ON inovacnj.fat_movimento_jest USING btree
    (npu  ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index: ix_tramitacao
CREATE INDEX ix_tramitacao
    ON inovacnj.fat_movimento_jest USING btree
    (tramitacao ASC NULLS LAST)
    TABLESPACE pg_default;
 
 -- Table: inovacnj.fat_movimento_jfed
CREATE TABLE inovacnj.fat_movimento_jfed
(
    codtribunal text ,
    grau text ,
    millisinsercao bigint,
    codclasse bigint,
    descclasse text ,
    codlocalidade text ,
    competencia text  NOT NULL,
    dtajuizamento timestamp without time zone,
    descsistema text ,
    nivelsigilo bigint,
    npu text ,
    valorcausa text ,
    tramitacao bigint,
    tamanhoprocesso text ,
    oj_codibge bigint,
    oj_cod text ,
    oj_instancia text ,
    oj_descricao text ,
    mov_dtmov timestamp without time zone,
    mov_cod bigint,
    descmovimento text ,
    mov_codlocal bigint,
    mov_codpainacional bigint,
    mov_nivelsigilo text ,
    mov_oj_codibge bigint,
    mov_oj_cod text ,
    mov_oj_instancia text ,
    mov_oj_descricao text ,
    mov_tpdecisao text  NOT NULL,
    mov_tprespmov text  NOT NULL
);

ALTER TABLE inovacnj.fat_movimento_jfed OWNER to inovacnj;

-- Table: inovacnj.fat_movimento_jmil
CREATE TABLE inovacnj.fat_movimento_jmil
(   codtribunal text ,
    grau text ,
    millisinsercao bigint,
    codclasse bigint,
    descclasse text ,
    codlocalidade text ,
    competencia text  NOT NULL,
    dtajuizamento timestamp without time zone,
    descsistema text ,
    nivelsigilo bigint,
    npu text ,
    valorcausa text ,
    tramitacao bigint,
    tamanhoprocesso text ,
    oj_codibge bigint,
    oj_cod text ,
    oj_instancia text ,
    oj_descricao text ,
    mov_dtmov timestamp without time zone,
    mov_cod bigint,
    descmovimento text ,
    mov_codlocal bigint,
    mov_codpainacional bigint,
    mov_nivelsigilo text ,
    mov_oj_codibge bigint,
    mov_oj_cod text ,
    mov_oj_instancia text ,
    mov_oj_descricao text ,
    mov_tpdecisao text  NOT NULL,
    mov_tprespmov text  NOT NULL
);

ALTER TABLE inovacnj.fat_movimento_jmil OWNER to inovacnj;
 
-- Table: inovacnj.fat_movimento_jtra
CREATE TABLE inovacnj.fat_movimento_jtra
(
    codtribunal text ,
    grau text ,
    millisinsercao bigint,
    codclasse bigint,
    descclasse text ,
    codlocalidade text ,
    competencia text  NOT NULL,
    dtajuizamento timestamp without time zone,
    descsistema text ,
    nivelsigilo bigint,
    npu text ,
    valorcausa text ,
    tramitacao bigint,
    tamanhoprocesso text ,
    oj_codibge bigint,
    oj_cod text ,
    oj_instancia text ,
    oj_descricao text ,
    mov_dtmov timestamp without time zone,
    mov_cod bigint,
    descmovimento text ,
    mov_codlocal bigint,
    mov_codpainacional bigint,
    mov_nivelsigilo text ,
    mov_oj_codibge bigint,
    mov_oj_cod text ,
    mov_oj_instancia text ,
    mov_oj_descricao text ,
    mov_tpdecisao text  NOT NULL,
    mov_tprespmov text  NOT NULL
);

ALTER TABLE inovacnj.fat_movimento_jtra  OWNER to inovacnj; 

-- Table: inovacnj.fat_movimentos_te
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
    descsistema text ,
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
    fase text ,
    mov_dtmov timestamp without time zone
);

ALTER TABLE inovacnj.fat_movimentos_te OWNER to inovacnj;

-- Index: ix_codoj
CREATE INDEX ix_codoj
    ON inovacnj.fat_movimentos_te USING btree
    (oj_cod  ASC NULLS LAST)
    TABLESPACE pg_default;
 
-- SEQUENCE: inovacnj.seq_fase
CREATE SEQUENCE inovacnj.seq_fase
    INCREMENT 1
    START 5;

ALTER SEQUENCE inovacnj.seq_fase
    OWNER TO inovacnj;

-- Table: inovacnj.clusteroj
CREATE TABLE inovacnj.clusteroj
(
    cod integer,
    descricao character varying(50),
    CONSTRAINT pk_clusteroj PRIMARY KEY (cod)
);

ALTER TABLE inovacnj.clusteroj OWNER to inovacnj;

-- Table: inovacnj.clusteroj_orgjulg
CREATE TABLE inovacnj.clusteroj_orgjulg
(
    cod_cluster integer,
    cod_orgao_julg integer,
    CONSTRAINT pk_clusteroj_orgjulg PRIMARY KEY (cod_cluster,cod_orgao_julg)
);

ALTER TABLE inovacnj.clusteroj_orgjulg OWNER to inovacnj;

-- Table: inovacnj.fitnessmodel_org_julg_atuacao
CREATE TABLE inovacnj.fitnessmodel_org_julg_atuacao
(
    tipo character varying(50),
    codtribunal character varying(10),
    atuacao_vara character varying(50),
    cod_orgao_julg integer,
    desc_orgao_julg character varying(200),
    trace_fitness real,
    CONSTRAINT pk_clusteroj_orgjulg PRIMARY KEY (tipo, codtribunal, atuacao_vara, cod_orgao_julg)
);

ALTER TABLE inovacnj.fitnessmodel_org_julg_atuacao OWNER to inovacnj;

-- MVs

-- View: inovacnj.mv_acervo_primmov_jele
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_primmov_jele
TABLESPACE pg_default
AS
 SELECT DISTINCT f.codtribunal,
    f.grau,
    f.npu,
    f.mov_dtmov AS dt_prim_mov,
    f.mov_cod,
    f.descmovimento,
    f.codclasse,
    f.descclasse,
    f.competencia,
    f.dtajuizamento,
        CASE
            WHEN (f.tramitacao = 1) THEN 'Sistema Eletrônico'::text
            WHEN (f.tramitacao = 2) THEN 'Sistema Físico'::text
            ELSE 'ND'::text
        END AS tramitacao,
    f.oj_cod,
    f.oj_descricao
   FROM fat_movimento_jele f,
    ( SELECT min(a.mov_dtmov) AS dt_pmov,
            a.npu
           FROM fat_movimento_jele a
          GROUP BY a.npu) pmov
  WHERE ((1 = 1) AND (f.npu = pmov.npu) AND (f.mov_dtmov = pmov.dt_pmov) AND (f.mov_cod = 26))
  ORDER BY f.mov_dtmov
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_primmov_jele  OWNER TO inovacnj;

-- View: inovacnj.mv_acervo_primmov_jest
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_primmov_jest
TABLESPACE pg_default
AS
 SELECT DISTINCT f.codtribunal,
    f.grau,
    f.npu,
    f.mov_dtmov AS dt_prim_mov,
    f.mov_cod,
    f.descmovimento,
    f.codclasse,
    f.descclasse,
    f.competencia,
    f.dtajuizamento,
        CASE
            WHEN (f.tramitacao = 1) THEN 'Sistema Eletrônico'::text
            WHEN (f.tramitacao = 2) THEN 'Sistema Físico'::text
            ELSE 'ND'::text
        END AS tramitacao,
    f.oj_cod,
    f.oj_descricao
   FROM fat_movimento_jest f,
    ( SELECT min(a.mov_dtmov) AS dt_pmov,
            a.npu
           FROM fat_movimento_jest a
          GROUP BY a.npu) pmov
  WHERE ((1 = 1) AND (f.npu = pmov.npu) AND (f.mov_dtmov = pmov.dt_pmov) AND (f.mov_cod = 26))
  ORDER BY f.mov_dtmov
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_primmov_jest  OWNER TO inovacnj;
                                                                              
-- View: inovacnj.mv_acervo_primmov_jfed
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_primmov_jfed
TABLESPACE pg_default
AS
 SELECT DISTINCT f.codtribunal,
    f.grau,
    f.npu,
    f.mov_dtmov AS dt_prim_mov,
    f.mov_cod,
    f.descmovimento,
    f.codclasse,
    f.descclasse,
    f.competencia,
    f.dtajuizamento,
        CASE
            WHEN (f.tramitacao = 1) THEN 'Sistema Eletrônico'::text
            WHEN (f.tramitacao = 2) THEN 'Sistema Físico'::text
            ELSE 'ND'::text
        END AS tramitacao,
    f.oj_cod,
    f.oj_descricao
   FROM fat_movimento_jfed f,
    ( SELECT min(a.mov_dtmov) AS dt_pmov,
            a.npu
           FROM fat_movimento_jfed a
          GROUP BY a.npu) pmov
  WHERE ((1 = 1) AND (f.npu = pmov.npu) AND (f.mov_dtmov = pmov.dt_pmov) AND (f.mov_cod = 26))
  ORDER BY f.mov_dtmov
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_primmov_jfed  OWNER TO inovacnj;                                                                              
                                                                              
-- View: inovacnj.mv_acervo_primmov_jmil
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_primmov_jmil
TABLESPACE pg_default
AS
 SELECT DISTINCT f.codtribunal,
    f.grau,
    f.npu,
    f.mov_dtmov AS dt_prim_mov,
    f.mov_cod,
    f.descmovimento,
    f.codclasse,
    f.descclasse,
    f.competencia,
    f.dtajuizamento,
        CASE
            WHEN (f.tramitacao = 1) THEN 'Sistema Eletrônico'::text
            WHEN (f.tramitacao = 2) THEN 'Sistema Físico'::text
            ELSE 'ND'::text
        END AS tramitacao,
    f.oj_cod,
    f.oj_descricao
   FROM fat_movimento_jmil f,
    ( SELECT min(a.mov_dtmov) AS dt_pmov,
            a.npu
           FROM fat_movimento_jmil a
          GROUP BY a.npu) pmov
  WHERE ((1 = 1) AND (f.npu = pmov.npu) AND (f.mov_dtmov = pmov.dt_pmov) AND (f.mov_cod = 26))
  ORDER BY f.mov_dtmov
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_primmov_jmil   OWNER TO inovacnj;                                                                              

-- View: inovacnj.mv_acervo_primmov_jtra
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_primmov_jtra
TABLESPACE pg_default
AS
 SELECT DISTINCT f.codtribunal,
    f.grau,
    f.npu,
    f.mov_dtmov AS dt_prim_mov,
    f.mov_cod,
    f.descmovimento,
    f.codclasse,
    f.descclasse,
    f.competencia,
    f.dtajuizamento,
        CASE
            WHEN (f.tramitacao = 1) THEN 'Sistema Eletrônico'::text
            WHEN (f.tramitacao = 2) THEN 'Sistema Físico'::text
            ELSE 'ND'::text
        END AS tramitacao,
    f.oj_cod,
    f.oj_descricao
   FROM fat_movimento_jtra f,
    ( SELECT min(a.mov_dtmov) AS dt_pmov,
            a.npu
           FROM fat_movimento_jtra a
          GROUP BY a.npu) pmov
  WHERE ((1 = 1) AND (f.npu = pmov.npu) AND (f.mov_dtmov = pmov.dt_pmov) AND (f.mov_cod = 26))
  ORDER BY f.mov_dtmov
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_primmov_jtra   OWNER TO inovacnj; 

-- View: inovacnj.mv_acervo_sentenca_jele
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_sentenca_jele
TABLESPACE pg_default
AS
 SELECT DISTINCT fat_movimento_jele.codtribunal,
    fat_movimento_jele.npu,
    fat_movimento_jele.oj_cod,
    fat_movimento_jele.oj_descricao
   FROM fat_movimento_jele
  WHERE ((1 = 1) AND (fat_movimento_jele.mov_cod = ANY (ARRAY[(218)::bigint, (385)::bigint, (228)::bigint, (230)::bigint, (235)::bigint, (236)::bigint, (244)::bigint, (456)::bigint, (853)::bigint, (10953)::bigint, (10961)::bigint, (11373)::bigint, (11394)::bigint, (11396)::bigint, (12184)::bigint, (12319)::bigint, (12458)::bigint, (12459)::bigint, (12709)::bigint, (472)::bigint, (473)::bigint, (454)::bigint, (457)::bigint, (458)::bigint, (459)::bigint, (460)::bigint, (461)::bigint, (462)::bigint, (463)::bigint, (464)::bigint, (465)::bigint, (11374)::bigint, (11375)::bigint, (11376)::bigint, (11377)::bigint, (11378)::bigint, (11379)::bigint, (11380)::bigint, (11381)::bigint, (12256)::bigint, (12298)::bigint, (12325)::bigint, (12617)::bigint, (12710)::bigint, (12711)::bigint, (12712)::bigint, (12713)::bigint, (12714)::bigint, (12715)::bigint, (12716)::bigint, (12717)::bigint, (12718)::bigint, (12719)::bigint, (12720)::bigint, (12721)::bigint, (12722)::bigint, (12723)::bigint, (12724)::bigint, (196)::bigint, (198)::bigint, (200)::bigint, (202)::bigint, (208)::bigint, (210)::bigint, (212)::bigint, (214)::bigint, (219)::bigint, (220)::bigint, (221)::bigint, (237)::bigint, (238)::bigint, (239)::bigint, (240)::bigint, (241)::bigint, (242)::bigint, (455)::bigint, (466)::bigint, (471)::bigint, (871)::bigint, (884)::bigint, (900)::bigint, (901)::bigint, (972)::bigint, (973)::bigint, (10964)::bigint, (11401)::bigint, (11402)::bigint, (11403)::bigint, (11404)::bigint, (11405)::bigint, (11406)::bigint, (11407)::bigint, (11408)::bigint, (11409)::bigint, (11795)::bigint, (11796)::bigint, (11876)::bigint, (11877)::bigint, (12187)::bigint, (12252)::bigint, (12253)::bigint, (12254)::bigint, (12257)::bigint, (12258)::bigint, (12321)::bigint, (12326)::bigint, (12329)::bigint, (12330)::bigint, (12331)::bigint, (12433)::bigint, (12450)::bigint, (12615)::bigint, (12649)::bigint, (12650)::bigint, (12651)::bigint, (12652)::bigint, (12653)::bigint, (12654)::bigint, (12660)::bigint, (12661)::bigint, (12662)::bigint, (12663)::bigint, (12664)::bigint, (12665)::bigint, (12678)::bigint, (12738)::bigint, (442)::bigint, (443)::bigint, (444)::bigint, (445)::bigint, (10965)::bigint, (12032)::bigint, (12041)::bigint, (12475)::bigint, (446)::bigint, (447)::bigint, (448)::bigint, (449)::bigint, (450)::bigint, (451)::bigint, (452)::bigint, (453)::bigint, (1042)::bigint, (1043)::bigint, (1044)::bigint, (1045)::bigint, (1046)::bigint, (1047)::bigint, (1048)::bigint, (1049)::bigint, (1050)::bigint, (11411)::bigint, (11801)::bigint, (11878)::bigint, (11879)::bigint, (12028)::bigint, (12616)::bigint, (12735)::bigint, (12322)::bigint, (12323)::bigint, (12324)::bigint, (12327)::bigint, (12328)::bigint, (12434)::bigint, (12435)::bigint, (12436)::bigint, (12437)::bigint, (12438)::bigint, (12439)::bigint, (12440)::bigint, (12441)::bigint, (12442)::bigint, (12443)::bigint, (12451)::bigint, (12452)::bigint, (12453)::bigint, (12666)::bigint, (12667)::bigint, (12668)::bigint, (12669)::bigint, (12670)::bigint, (12672)::bigint, (12673)::bigint, (12674)::bigint, (12675)::bigint, (12676)::bigint, (12677)::bigint, (12792)::bigint, (12671)::bigint, (12679)::bigint, (12680)::bigint, (12681)::bigint, (12682)::bigint, (12683)::bigint, (12684)::bigint, (12685)::bigint, (12686)::bigint, (12687)::bigint, (12688)::bigint, (12689)::bigint, (12690)::bigint, (12691)::bigint, (12692)::bigint, (12693)::bigint, (12694)::bigint, (12695)::bigint, (12696)::bigint, (12697)::bigint, (12698)::bigint, (12699)::bigint, (12700)::bigint, (12701)::bigint, (12702)::bigint, (12703)::bigint, (12704)::bigint, (12705)::bigint, (12706)::bigint, (12707)::bigint, (12708)::bigint])))
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_sentenca_jele  OWNER TO inovacnj;                                                                              

-- View: inovacnj.mv_acervo_sentenca_jest
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_sentenca_jest
TABLESPACE pg_default
AS
 SELECT DISTINCT fat_movimento_jest.codtribunal,
    fat_movimento_jest.npu,
    fat_movimento_jest.oj_cod,
    fat_movimento_jest.oj_descricao
   FROM fat_movimento_jest
  WHERE ((1 = 1) AND (fat_movimento_jest.mov_cod = ANY (ARRAY[(218)::bigint, (385)::bigint, (228)::bigint, (230)::bigint, (235)::bigint, (236)::bigint, (244)::bigint, (456)::bigint, (853)::bigint, (10953)::bigint, (10961)::bigint, (11373)::bigint, (11394)::bigint, (11396)::bigint, (12184)::bigint, (12319)::bigint, (12458)::bigint, (12459)::bigint, (12709)::bigint, (472)::bigint, (473)::bigint, (454)::bigint, (457)::bigint, (458)::bigint, (459)::bigint, (460)::bigint, (461)::bigint, (462)::bigint, (463)::bigint, (464)::bigint, (465)::bigint, (11374)::bigint, (11375)::bigint, (11376)::bigint, (11377)::bigint, (11378)::bigint, (11379)::bigint, (11380)::bigint, (11381)::bigint, (12256)::bigint, (12298)::bigint, (12325)::bigint, (12617)::bigint, (12710)::bigint, (12711)::bigint, (12712)::bigint, (12713)::bigint, (12714)::bigint, (12715)::bigint, (12716)::bigint, (12717)::bigint, (12718)::bigint, (12719)::bigint, (12720)::bigint, (12721)::bigint, (12722)::bigint, (12723)::bigint, (12724)::bigint, (196)::bigint, (198)::bigint, (200)::bigint, (202)::bigint, (208)::bigint, (210)::bigint, (212)::bigint, (214)::bigint, (219)::bigint, (220)::bigint, (221)::bigint, (237)::bigint, (238)::bigint, (239)::bigint, (240)::bigint, (241)::bigint, (242)::bigint, (455)::bigint, (466)::bigint, (471)::bigint, (871)::bigint, (884)::bigint, (900)::bigint, (901)::bigint, (972)::bigint, (973)::bigint, (10964)::bigint, (11401)::bigint, (11402)::bigint, (11403)::bigint, (11404)::bigint, (11405)::bigint, (11406)::bigint, (11407)::bigint, (11408)::bigint, (11409)::bigint, (11795)::bigint, (11796)::bigint, (11876)::bigint, (11877)::bigint, (12187)::bigint, (12252)::bigint, (12253)::bigint, (12254)::bigint, (12257)::bigint, (12258)::bigint, (12321)::bigint, (12326)::bigint, (12329)::bigint, (12330)::bigint, (12331)::bigint, (12433)::bigint, (12450)::bigint, (12615)::bigint, (12649)::bigint, (12650)::bigint, (12651)::bigint, (12652)::bigint, (12653)::bigint, (12654)::bigint, (12660)::bigint, (12661)::bigint, (12662)::bigint, (12663)::bigint, (12664)::bigint, (12665)::bigint, (12678)::bigint, (12738)::bigint, (442)::bigint, (443)::bigint, (444)::bigint, (445)::bigint, (10965)::bigint, (12032)::bigint, (12041)::bigint, (12475)::bigint, (446)::bigint, (447)::bigint, (448)::bigint, (449)::bigint, (450)::bigint, (451)::bigint, (452)::bigint, (453)::bigint, (1042)::bigint, (1043)::bigint, (1044)::bigint, (1045)::bigint, (1046)::bigint, (1047)::bigint, (1048)::bigint, (1049)::bigint, (1050)::bigint, (11411)::bigint, (11801)::bigint, (11878)::bigint, (11879)::bigint, (12028)::bigint, (12616)::bigint, (12735)::bigint, (12322)::bigint, (12323)::bigint, (12324)::bigint, (12327)::bigint, (12328)::bigint, (12434)::bigint, (12435)::bigint, (12436)::bigint, (12437)::bigint, (12438)::bigint, (12439)::bigint, (12440)::bigint, (12441)::bigint, (12442)::bigint, (12443)::bigint, (12451)::bigint, (12452)::bigint, (12453)::bigint, (12666)::bigint, (12667)::bigint, (12668)::bigint, (12669)::bigint, (12670)::bigint, (12672)::bigint, (12673)::bigint, (12674)::bigint, (12675)::bigint, (12676)::bigint, (12677)::bigint, (12792)::bigint, (12671)::bigint, (12679)::bigint, (12680)::bigint, (12681)::bigint, (12682)::bigint, (12683)::bigint, (12684)::bigint, (12685)::bigint, (12686)::bigint, (12687)::bigint, (12688)::bigint, (12689)::bigint, (12690)::bigint, (12691)::bigint, (12692)::bigint, (12693)::bigint, (12694)::bigint, (12695)::bigint, (12696)::bigint, (12697)::bigint, (12698)::bigint, (12699)::bigint, (12700)::bigint, (12701)::bigint, (12702)::bigint, (12703)::bigint, (12704)::bigint, (12705)::bigint, (12706)::bigint, (12707)::bigint, (12708)::bigint])))
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_sentenca_jest   OWNER TO inovacnj;                      
             
-- View: inovacnj.mv_acervo_sentenca_jfed
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_sentenca_jfed
TABLESPACE pg_default
AS
 SELECT DISTINCT fat_movimento_jfed.codtribunal,
    fat_movimento_jfed.npu,
    fat_movimento_jfed.oj_cod,
    fat_movimento_jfed.oj_descricao
   FROM fat_movimento_jfed
  WHERE ((1 = 1) AND (fat_movimento_jfed.mov_cod = ANY (ARRAY[(218)::bigint, (385)::bigint, (228)::bigint, (230)::bigint, (235)::bigint, (236)::bigint, (244)::bigint, (456)::bigint, (853)::bigint, (10953)::bigint, (10961)::bigint, (11373)::bigint, (11394)::bigint, (11396)::bigint, (12184)::bigint, (12319)::bigint, (12458)::bigint, (12459)::bigint, (12709)::bigint, (472)::bigint, (473)::bigint, (454)::bigint, (457)::bigint, (458)::bigint, (459)::bigint, (460)::bigint, (461)::bigint, (462)::bigint, (463)::bigint, (464)::bigint, (465)::bigint, (11374)::bigint, (11375)::bigint, (11376)::bigint, (11377)::bigint, (11378)::bigint, (11379)::bigint, (11380)::bigint, (11381)::bigint, (12256)::bigint, (12298)::bigint, (12325)::bigint, (12617)::bigint, (12710)::bigint, (12711)::bigint, (12712)::bigint, (12713)::bigint, (12714)::bigint, (12715)::bigint, (12716)::bigint, (12717)::bigint, (12718)::bigint, (12719)::bigint, (12720)::bigint, (12721)::bigint, (12722)::bigint, (12723)::bigint, (12724)::bigint, (196)::bigint, (198)::bigint, (200)::bigint, (202)::bigint, (208)::bigint, (210)::bigint, (212)::bigint, (214)::bigint, (219)::bigint, (220)::bigint, (221)::bigint, (237)::bigint, (238)::bigint, (239)::bigint, (240)::bigint, (241)::bigint, (242)::bigint, (455)::bigint, (466)::bigint, (471)::bigint, (871)::bigint, (884)::bigint, (900)::bigint, (901)::bigint, (972)::bigint, (973)::bigint, (10964)::bigint, (11401)::bigint, (11402)::bigint, (11403)::bigint, (11404)::bigint, (11405)::bigint, (11406)::bigint, (11407)::bigint, (11408)::bigint, (11409)::bigint, (11795)::bigint, (11796)::bigint, (11876)::bigint, (11877)::bigint, (12187)::bigint, (12252)::bigint, (12253)::bigint, (12254)::bigint, (12257)::bigint, (12258)::bigint, (12321)::bigint, (12326)::bigint, (12329)::bigint, (12330)::bigint, (12331)::bigint, (12433)::bigint, (12450)::bigint, (12615)::bigint, (12649)::bigint, (12650)::bigint, (12651)::bigint, (12652)::bigint, (12653)::bigint, (12654)::bigint, (12660)::bigint, (12661)::bigint, (12662)::bigint, (12663)::bigint, (12664)::bigint, (12665)::bigint, (12678)::bigint, (12738)::bigint, (442)::bigint, (443)::bigint, (444)::bigint, (445)::bigint, (10965)::bigint, (12032)::bigint, (12041)::bigint, (12475)::bigint, (446)::bigint, (447)::bigint, (448)::bigint, (449)::bigint, (450)::bigint, (451)::bigint, (452)::bigint, (453)::bigint, (1042)::bigint, (1043)::bigint, (1044)::bigint, (1045)::bigint, (1046)::bigint, (1047)::bigint, (1048)::bigint, (1049)::bigint, (1050)::bigint, (11411)::bigint, (11801)::bigint, (11878)::bigint, (11879)::bigint, (12028)::bigint, (12616)::bigint, (12735)::bigint, (12322)::bigint, (12323)::bigint, (12324)::bigint, (12327)::bigint, (12328)::bigint, (12434)::bigint, (12435)::bigint, (12436)::bigint, (12437)::bigint, (12438)::bigint, (12439)::bigint, (12440)::bigint, (12441)::bigint, (12442)::bigint, (12443)::bigint, (12451)::bigint, (12452)::bigint, (12453)::bigint, (12666)::bigint, (12667)::bigint, (12668)::bigint, (12669)::bigint, (12670)::bigint, (12672)::bigint, (12673)::bigint, (12674)::bigint, (12675)::bigint, (12676)::bigint, (12677)::bigint, (12792)::bigint, (12671)::bigint, (12679)::bigint, (12680)::bigint, (12681)::bigint, (12682)::bigint, (12683)::bigint, (12684)::bigint, (12685)::bigint, (12686)::bigint, (12687)::bigint, (12688)::bigint, (12689)::bigint, (12690)::bigint, (12691)::bigint, (12692)::bigint, (12693)::bigint, (12694)::bigint, (12695)::bigint, (12696)::bigint, (12697)::bigint, (12698)::bigint, (12699)::bigint, (12700)::bigint, (12701)::bigint, (12702)::bigint, (12703)::bigint, (12704)::bigint, (12705)::bigint, (12706)::bigint, (12707)::bigint, (12708)::bigint])))
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_sentenca_jfed  OWNER TO inovacnj;        

-- View: inovacnj.mv_acervo_sentenca_jmil
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_sentenca_jmil
TABLESPACE pg_default
AS
 SELECT DISTINCT fat_movimento_jmil.codtribunal,
    fat_movimento_jmil.npu,
    fat_movimento_jmil.oj_cod,
    fat_movimento_jmil.oj_descricao
   FROM fat_movimento_jmil
  WHERE ((1 = 1) AND (fat_movimento_jmil.mov_cod = ANY (ARRAY[(218)::bigint, (385)::bigint, (228)::bigint, (230)::bigint, (235)::bigint, (236)::bigint, (244)::bigint, (456)::bigint, (853)::bigint, (10953)::bigint, (10961)::bigint, (11373)::bigint, (11394)::bigint, (11396)::bigint, (12184)::bigint, (12319)::bigint, (12458)::bigint, (12459)::bigint, (12709)::bigint, (472)::bigint, (473)::bigint, (454)::bigint, (457)::bigint, (458)::bigint, (459)::bigint, (460)::bigint, (461)::bigint, (462)::bigint, (463)::bigint, (464)::bigint, (465)::bigint, (11374)::bigint, (11375)::bigint, (11376)::bigint, (11377)::bigint, (11378)::bigint, (11379)::bigint, (11380)::bigint, (11381)::bigint, (12256)::bigint, (12298)::bigint, (12325)::bigint, (12617)::bigint, (12710)::bigint, (12711)::bigint, (12712)::bigint, (12713)::bigint, (12714)::bigint, (12715)::bigint, (12716)::bigint, (12717)::bigint, (12718)::bigint, (12719)::bigint, (12720)::bigint, (12721)::bigint, (12722)::bigint, (12723)::bigint, (12724)::bigint, (196)::bigint, (198)::bigint, (200)::bigint, (202)::bigint, (208)::bigint, (210)::bigint, (212)::bigint, (214)::bigint, (219)::bigint, (220)::bigint, (221)::bigint, (237)::bigint, (238)::bigint, (239)::bigint, (240)::bigint, (241)::bigint, (242)::bigint, (455)::bigint, (466)::bigint, (471)::bigint, (871)::bigint, (884)::bigint, (900)::bigint, (901)::bigint, (972)::bigint, (973)::bigint, (10964)::bigint, (11401)::bigint, (11402)::bigint, (11403)::bigint, (11404)::bigint, (11405)::bigint, (11406)::bigint, (11407)::bigint, (11408)::bigint, (11409)::bigint, (11795)::bigint, (11796)::bigint, (11876)::bigint, (11877)::bigint, (12187)::bigint, (12252)::bigint, (12253)::bigint, (12254)::bigint, (12257)::bigint, (12258)::bigint, (12321)::bigint, (12326)::bigint, (12329)::bigint, (12330)::bigint, (12331)::bigint, (12433)::bigint, (12450)::bigint, (12615)::bigint, (12649)::bigint, (12650)::bigint, (12651)::bigint, (12652)::bigint, (12653)::bigint, (12654)::bigint, (12660)::bigint, (12661)::bigint, (12662)::bigint, (12663)::bigint, (12664)::bigint, (12665)::bigint, (12678)::bigint, (12738)::bigint, (442)::bigint, (443)::bigint, (444)::bigint, (445)::bigint, (10965)::bigint, (12032)::bigint, (12041)::bigint, (12475)::bigint, (446)::bigint, (447)::bigint, (448)::bigint, (449)::bigint, (450)::bigint, (451)::bigint, (452)::bigint, (453)::bigint, (1042)::bigint, (1043)::bigint, (1044)::bigint, (1045)::bigint, (1046)::bigint, (1047)::bigint, (1048)::bigint, (1049)::bigint, (1050)::bigint, (11411)::bigint, (11801)::bigint, (11878)::bigint, (11879)::bigint, (12028)::bigint, (12616)::bigint, (12735)::bigint, (12322)::bigint, (12323)::bigint, (12324)::bigint, (12327)::bigint, (12328)::bigint, (12434)::bigint, (12435)::bigint, (12436)::bigint, (12437)::bigint, (12438)::bigint, (12439)::bigint, (12440)::bigint, (12441)::bigint, (12442)::bigint, (12443)::bigint, (12451)::bigint, (12452)::bigint, (12453)::bigint, (12666)::bigint, (12667)::bigint, (12668)::bigint, (12669)::bigint, (12670)::bigint, (12672)::bigint, (12673)::bigint, (12674)::bigint, (12675)::bigint, (12676)::bigint, (12677)::bigint, (12792)::bigint, (12671)::bigint, (12679)::bigint, (12680)::bigint, (12681)::bigint, (12682)::bigint, (12683)::bigint, (12684)::bigint, (12685)::bigint, (12686)::bigint, (12687)::bigint, (12688)::bigint, (12689)::bigint, (12690)::bigint, (12691)::bigint, (12692)::bigint, (12693)::bigint, (12694)::bigint, (12695)::bigint, (12696)::bigint, (12697)::bigint, (12698)::bigint, (12699)::bigint, (12700)::bigint, (12701)::bigint, (12702)::bigint, (12703)::bigint, (12704)::bigint, (12705)::bigint, (12706)::bigint, (12707)::bigint, (12708)::bigint])))
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_sentenca_jmil  OWNER TO inovacnj;  

-- View: inovacnj.mv_acervo_sentenca_jtra
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_sentenca_jtra
TABLESPACE pg_default
AS
 SELECT DISTINCT fat_movimento_jtra.codtribunal,
    fat_movimento_jtra.npu,
    fat_movimento_jtra.oj_cod,
    fat_movimento_jtra.oj_descricao
   FROM fat_movimento_jtra
  WHERE ((1 = 1) AND (fat_movimento_jtra.mov_cod = ANY (ARRAY[(218)::bigint, (385)::bigint, (228)::bigint, (230)::bigint, (235)::bigint, (236)::bigint, (244)::bigint, (456)::bigint, (853)::bigint, (10953)::bigint, (10961)::bigint, (11373)::bigint, (11394)::bigint, (11396)::bigint, (12184)::bigint, (12319)::bigint, (12458)::bigint, (12459)::bigint, (12709)::bigint, (472)::bigint, (473)::bigint, (454)::bigint, (457)::bigint, (458)::bigint, (459)::bigint, (460)::bigint, (461)::bigint, (462)::bigint, (463)::bigint, (464)::bigint, (465)::bigint, (11374)::bigint, (11375)::bigint, (11376)::bigint, (11377)::bigint, (11378)::bigint, (11379)::bigint, (11380)::bigint, (11381)::bigint, (12256)::bigint, (12298)::bigint, (12325)::bigint, (12617)::bigint, (12710)::bigint, (12711)::bigint, (12712)::bigint, (12713)::bigint, (12714)::bigint, (12715)::bigint, (12716)::bigint, (12717)::bigint, (12718)::bigint, (12719)::bigint, (12720)::bigint, (12721)::bigint, (12722)::bigint, (12723)::bigint, (12724)::bigint, (196)::bigint, (198)::bigint, (200)::bigint, (202)::bigint, (208)::bigint, (210)::bigint, (212)::bigint, (214)::bigint, (219)::bigint, (220)::bigint, (221)::bigint, (237)::bigint, (238)::bigint, (239)::bigint, (240)::bigint, (241)::bigint, (242)::bigint, (455)::bigint, (466)::bigint, (471)::bigint, (871)::bigint, (884)::bigint, (900)::bigint, (901)::bigint, (972)::bigint, (973)::bigint, (10964)::bigint, (11401)::bigint, (11402)::bigint, (11403)::bigint, (11404)::bigint, (11405)::bigint, (11406)::bigint, (11407)::bigint, (11408)::bigint, (11409)::bigint, (11795)::bigint, (11796)::bigint, (11876)::bigint, (11877)::bigint, (12187)::bigint, (12252)::bigint, (12253)::bigint, (12254)::bigint, (12257)::bigint, (12258)::bigint, (12321)::bigint, (12326)::bigint, (12329)::bigint, (12330)::bigint, (12331)::bigint, (12433)::bigint, (12450)::bigint, (12615)::bigint, (12649)::bigint, (12650)::bigint, (12651)::bigint, (12652)::bigint, (12653)::bigint, (12654)::bigint, (12660)::bigint, (12661)::bigint, (12662)::bigint, (12663)::bigint, (12664)::bigint, (12665)::bigint, (12678)::bigint, (12738)::bigint, (442)::bigint, (443)::bigint, (444)::bigint, (445)::bigint, (10965)::bigint, (12032)::bigint, (12041)::bigint, (12475)::bigint, (446)::bigint, (447)::bigint, (448)::bigint, (449)::bigint, (450)::bigint, (451)::bigint, (452)::bigint, (453)::bigint, (1042)::bigint, (1043)::bigint, (1044)::bigint, (1045)::bigint, (1046)::bigint, (1047)::bigint, (1048)::bigint, (1049)::bigint, (1050)::bigint, (11411)::bigint, (11801)::bigint, (11878)::bigint, (11879)::bigint, (12028)::bigint, (12616)::bigint, (12735)::bigint, (12322)::bigint, (12323)::bigint, (12324)::bigint, (12327)::bigint, (12328)::bigint, (12434)::bigint, (12435)::bigint, (12436)::bigint, (12437)::bigint, (12438)::bigint, (12439)::bigint, (12440)::bigint, (12441)::bigint, (12442)::bigint, (12443)::bigint, (12451)::bigint, (12452)::bigint, (12453)::bigint, (12666)::bigint, (12667)::bigint, (12668)::bigint, (12669)::bigint, (12670)::bigint, (12672)::bigint, (12673)::bigint, (12674)::bigint, (12675)::bigint, (12676)::bigint, (12677)::bigint, (12792)::bigint, (12671)::bigint, (12679)::bigint, (12680)::bigint, (12681)::bigint, (12682)::bigint, (12683)::bigint, (12684)::bigint, (12685)::bigint, (12686)::bigint, (12687)::bigint, (12688)::bigint, (12689)::bigint, (12690)::bigint, (12691)::bigint, (12692)::bigint, (12693)::bigint, (12694)::bigint, (12695)::bigint, (12696)::bigint, (12697)::bigint, (12698)::bigint, (12699)::bigint, (12700)::bigint, (12701)::bigint, (12702)::bigint, (12703)::bigint, (12704)::bigint, (12705)::bigint, (12706)::bigint, (12707)::bigint, (12708)::bigint])))
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_sentenca_jtra  OWNER TO inovacnj;                      
                      
-- View: inovacnj.mv_acervo_ultmov_jele
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_ultmov_jele
TABLESPACE pg_default
AS
 SELECT DISTINCT f.codtribunal,
    f.grau,
    f.npu,
    f.mov_dtmov AS dt_ult_mov,
    f.mov_cod,
    f.descmovimento,
    f.codclasse,
    f.descclasse,
    f.competencia,
    f.dtajuizamento,
        CASE
            WHEN (f.tramitacao = 1) THEN 'Sistema Eletrônico'::text
            WHEN (f.tramitacao = 2) THEN 'Sistema Físico'::text
            ELSE 'ND'::text
        END AS tramitacao,
    f.oj_cod,
    f.oj_descricao
   FROM fat_movimento_jele f,
    ( SELECT max(a.mov_dtmov) AS dt_ultmov,
            a.npu
           FROM fat_movimento_jele a
          GROUP BY a.npu) umov
  WHERE ((1 = 1) AND (f.npu = umov.npu) AND (f.mov_dtmov = umov.dt_ultmov))
  ORDER BY f.mov_dtmov
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_ultmov_jele   OWNER TO inovacnj;     

-- View: inovacnj.mv_acervo_ultmov_jest
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_ultmov_jest
TABLESPACE pg_default
AS
 SELECT DISTINCT f.codtribunal,
    f.grau,
    f.npu,
    f.mov_dtmov AS dt_ult_mov,
    f.mov_cod,
    f.descmovimento,
    f.codclasse,
    f.descclasse,
    f.competencia,
    f.dtajuizamento,
        CASE
            WHEN (f.tramitacao = 1) THEN 'Sistema Eletrônico'::text
            WHEN (f.tramitacao = 2) THEN 'Sistema Físico'::text
            ELSE 'ND'::text
        END AS tramitacao,
    f.oj_cod,
    f.oj_descricao
   FROM fat_movimento_jest f,
    ( SELECT max(a.mov_dtmov) AS dt_ultmov,
            a.npu
           FROM fat_movimento_jest a
          GROUP BY a.npu) umov
  WHERE ((1 = 1) AND (f.npu = umov.npu) AND (f.mov_dtmov = umov.dt_ultmov))
  ORDER BY f.mov_dtmov
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_ultmov_jest   OWNER TO inovacnj;
   
-- View: inovacnj.mv_acervo_ultmov_jfed
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_ultmov_jfed
TABLESPACE pg_default
AS
 SELECT DISTINCT f.codtribunal,
    f.grau,
    f.npu,
    f.mov_dtmov AS dt_ult_mov,
    f.mov_cod,
    f.descmovimento,
    f.codclasse,
    f.descclasse,
    f.competencia,
    f.dtajuizamento,
        CASE
            WHEN (f.tramitacao = 1) THEN 'Sistema Eletrônico'::text
            WHEN (f.tramitacao = 2) THEN 'Sistema Físico'::text
            ELSE 'ND'::text
        END AS tramitacao,
    f.oj_cod,
    f.oj_descricao
   FROM fat_movimento_jfed f,
    ( SELECT max(a.mov_dtmov) AS dt_ultmov,
            a.npu
           FROM fat_movimento_jfed a
          GROUP BY a.npu) umov
  WHERE ((1 = 1) AND (f.npu = umov.npu) AND (f.mov_dtmov = umov.dt_ultmov))
  ORDER BY f.mov_dtmov
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_ultmov_jfed   OWNER TO inovacnj;  
                                             
-- View: inovacnj.mv_acervo_ultmov_jmil
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_ultmov_jmil
TABLESPACE pg_default
AS
 SELECT DISTINCT f.codtribunal,
    f.grau,
    f.npu,
    f.mov_dtmov AS dt_ult_mov,
    f.mov_cod,
    f.descmovimento,
    f.codclasse,
    f.descclasse,
    f.competencia,
    f.dtajuizamento,
        CASE
            WHEN (f.tramitacao = 1) THEN 'Sistema Eletrônico'::text
            WHEN (f.tramitacao = 2) THEN 'Sistema Físico'::text
            ELSE 'ND'::text
        END AS tramitacao,
    f.oj_cod,
    f.oj_descricao
   FROM fat_movimento_jmil f,
    ( SELECT max(a.mov_dtmov) AS dt_ultmov,
            a.npu
           FROM fat_movimento_jmil a
          GROUP BY a.npu) umov
  WHERE ((1 = 1) AND (f.npu = umov.npu) AND (f.mov_dtmov = umov.dt_ultmov))
  ORDER BY f.mov_dtmov
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_ultmov_jmil   OWNER TO inovacnj;       
                                             
-- View: inovacnj.mv_acervo_ultmov_jtra
CREATE MATERIALIZED VIEW inovacnj.mv_acervo_ultmov_jtra
TABLESPACE pg_default
AS
 SELECT DISTINCT f.codtribunal,
    f.grau,
    f.npu,
    f.mov_dtmov AS dt_ult_mov,
    f.mov_cod,
    f.descmovimento,
    f.codclasse,
    f.descclasse,
    f.competencia,
    f.dtajuizamento,
        CASE
            WHEN (f.tramitacao = 1) THEN 'Sistema Eletrônico'::text
            WHEN (f.tramitacao = 2) THEN 'Sistema Físico'::text
            ELSE 'ND'::text
        END AS tramitacao,
    f.oj_cod,
    f.oj_descricao
   FROM fat_movimento_jtra f,
    ( SELECT max(a.mov_dtmov) AS dt_ultmov,
            a.npu
           FROM fat_movimento_jtra a
          GROUP BY a.npu) umov
  WHERE ((1 = 1) AND (f.npu = umov.npu) AND (f.mov_dtmov = umov.dt_ultmov))
  ORDER BY f.mov_dtmov
WITH DATA;

ALTER TABLE inovacnj.mv_acervo_ultmov_jtra  OWNER TO inovacnj;
                                             
                                             
