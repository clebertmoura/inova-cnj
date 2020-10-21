# EITA - Mais que dados, informação estratégica

Projeto elaborado para Hackathon Inova CNJ, desafio 01.

[Live Demo] (http://161.97.71.108:8080)

## Equipe

- Cleber Tavares de Moura <cleber.moura@tjpe.jus.br>
- Fabio Cruz Tavares <fabio.cruz.tavares@tjpe.jus.br>
- Hadautho Roberto Barros Da Silva <hadautho.barros@tjpe.jus.br>
- Jose Faustino Macedo De Souza Ferreira <faustino.ferreira@tjpe.jus.br>
- Luiz Henrique Nogueira Seus <luiz.seus@tjpe.jus.br>
- Suely Cleonice Batista <suely.batista@tjpe.jus.br>

## Tecnologias utilizadas

- Docker
- Python 3
- Jupyter
- Apache Spark 3.0.1 (pyspark)
- Postgres 10
- Metabase 0.36

## Arquitetura e módulos do projeto

O diagrama abaixo, apresenta os módulos da solução, com as respectivas tecnologias embarcadas em cada container.

![alt text](https://github.com/clebertmoura/inova-cnj/blob/main/diagrama-tecnologias.png)

- *ia-core*
> Módulo responsável por realizar o processamento dos dados, tratamento e carga na base de dados. É também responsável pela implementação dos modelos de Process Mining. Disponibiliza uma API, para consulta aos dados e modelos.

- *ia-server*
> Módulo responsável por implementar os modelos preditivos com inteligência artificial. Disponibiliza uma API para consulta.

- *frontend*
> Módulo que disponibiliza a interface do usuário. Se comunica com as APIs disponibilizadas pelos modulos `ia-core` e `ia-server`.

## Preparação dos dados

Na pasta `work` está disponível o arquivo `base.zip` que contem um subconjunto dos dados diponibilizados pelo CNJ. Este arquivo deve ser descompactado dentro da pasta `work`.

Para demonstração, estamos utilizado apenas os arquivos dos Tribunais Estaduais, incluindo todos os arquivos do TJPE, e mais 1 arquivo dos demais tribunais.

## Efetuando o build da imagem Docker

Antes de iniciar o ambiente, é necessário buildar as imagens docker dos modulos `ia-core`, `ia-server` e `frontend`.

Para isso, execute o script abaixo:

> ./build-images.sh

Ou se preferir, faça o build separadamente acessando o sub-diretório de cada modulo e executando o comando respectivo abaixo:

### Build da imagem: inova-cnj-iacore

> docker build -t inova-cnj-iacore .

### Build da imagem: inova-cnj-frontend

> docker build -t inova-cnj-frontend .

### Build da imagem: inova-cnj-iaserver

> docker build -t inova-cnj-iaserver .

## Iniciando o ambiente

Para inicar o ambiente, é necessário que o docker local esteja com o swarm manager ativado, para isso, execute o comando abaixo:

> docker swarm init

Em seguida, acesse o diretório raiz do projeto, e execute o comando abaixo:

> docker-compose up -d

Para listar os serviços em execução, acesse o diretório raiz do projeto, execute o comando abaixo:

> docker-compose ps

Para acessar os logs de cada serviço, basta executar o comando abaixo: 

> docker-compose logs -f [nome do serviço]

Para encerrar o ambiente

No diretório raiz do projeto, executar o comando abaixo:

> docker-compose down

## Acessar o jupyter notebook

Para acessar a console do jupyter, é necessário saber qual a URL de acesso. Para isso, acesse os logs do container ia-core, digitando o seguinte comando:

> docker-compose logs -f ia-core

Os logs serão exibidos, com uma URL similar a URL abaixo:

> http://127.0.0.1:8888/?token=adcd2bc95167732e71741f5e9f15cbb9d097013840c66d8b

## Acessar o pgAdmin

Para acessar a console do pgAdmin, acesse o link com as credenciais abaixo:

- Endereço: http://127.0.0.1:16543
- e-mail: cleber.moura@tjpe.jus.br
- senha: inovacnj@admin

## Acessar o metabase

Para acessar o metabase, acesse o link abaixo:

- Endereço: http://127.0.0.1:3000

No primeiro acesso, será solicitada a criação do usuário administrador.

# Modelo de dados

O projeto contempla uma modelagem dimensional para facilitar a criação de dashboards com indicadores de performance.

![alt text](https://github.com/clebertmoura/inova-cnj/blob/main/dbinova_model.png)

## Scripts DDL
DDL do modelo dimensional está definido no arquivo: `./bi/schema/1-init.sql`


# ETL dos dados

Para processamento, tratamento e carga dos dados estamos utilizando a tecnologia PySpark da Apache, que possíbiliza realizar o processamento de elevados volumes de dados de forma escalável. Esta ferramenta é amplamente utilizada em projetos de BigData.

## O processo de ETL

Todo o processo de ETL está implementado em um script python, no arquivo: `ETL-CarregarDadosNasDimensoes.ipynb`, com comentários em cada seção.

1. Primeiramente, efetuamos o carregamento das dimensões utilizando os arquivos CSV fornecidos.
2. Com base na estrutura dos arquivos JSON fornecidos, definimos um SCHEMA (estrutura de dados) prevendo todos os atributos e relacionamentos existentes;
3. O script faz a leitura do diretório de forma recursiva para efetuar o carrgamento de todos os arquivos no diretório;
4. Cada arquivo é carregado para um dataframe e depois todos os dataframes são unidos em um único dataframe;
5. As linhas duplicadas são removidas
6. O resultado é persistido em uma tabela FATO.

## APIs

Na solução foi disponibilizada uma API para consumo dos dados, geração dos modelos de Proccess Mining e de Predição com IA.

# Módulo IA/Estatíticas:

##Descrição:

	O módulo de IA e estatísticas foi criado para disponibilizar previsões e classificações baseadas em inteligência artificial bem como insights estatísticos gerados pelos cientistas de dados a partir dos dados disponíveis.

	Esse módulo faz uso de uma base de processos interna cujo cadastramento poder ser realizado em lote ou individualmente. Esse banco de dados faz uso de informações básicas do processo juntamente com as suas informações de fases geradas. Ao realizar a consulta a esse banco de dados a partir da NPU do processo, o módulo faz uso das informações cadastradas na submissão aos modelos de classificação e regressão, bem como a consulta aos dados de validações estatísticas previamente realizadas para exibição em tela.

##Informações utilizadas do processo:

- NPU
- Data de ajuizamento
- Orgão julgador (código e nome)
- Código da localidade do IBGE do orgão Julgador
- Natureza do processo
- Classe (código e descrição)
- Assunto (código e descrição)
- Porte do tribunal segundo o CNJ (pequeno, médio ou grande)

##Informações cadastradas das fases dos processos:

- Identificador sequencial da fase
- Nome da fase
- Duração da fase
- Status (concluído, em andamento ou não realizado)


##Da geração dos dados:

	Utilizando os dados do datajud agrupados através do Spark utilizado nos demais módulos do sistema na granularidade movimento, foram realizadas diversas transformações, combinações e filtros com a ferramenta KNIME (http://www.knime.com/) em sua versão Community, sem uso de nenhuma funcionalidade específica que não pudesse ser realizada com bancos de dados ou demais ferramentas com versões gratuitas no mercado. Imagens dos fluxos bem como seus dados arquivos para importação estão disponíveis dentro da pasta “etl_knime” dentro da pasta do servidor (ia-server).

##Algumas das operações realizadas:

- Troca de granulosidade para a visualização de processos (geração da informação de primeira e última movimentação por processo)
- Corte dos dados para trabalhar apenas processos ajuizados a partir de 01/01/2000
- Corte dos dados para trabalhar processos que tiveram a distribuição como primeiro movimento e o arquivamento definitivo como último movimento
- Cálculo da duração dos processos como a diferença em dias da última movimentação para a primeira
- Agrupamento das fases de acordo com a classificação do especialista e cálculo da duração das mesmas como diferença entre a primeira e a última movimentação de cada fase
- Geração duas visões dos processos que possuem "movimentos críticos” (movimentos cuja duração foi mais do que 100 dias) para indicação na ferramenta. Uma visão utiliza como chave de indexação o tribunal juntamente com a classe e o assunto do processo enquanto a segunda visão acrescenta o órgão julgador à chave anterior
- Nesta visualização foram utilizados apenas os processos da justiça estadual em todos as suas unidades.

##Modelos de IA

	Neste módulo foram criados 4 modelos de regressão e 1 modelo de classificação, todos fazendo uso da mesma visão de dados que, por decisão de projeto, ignora a identificação do tribunal, utilizando o seu porte como entrada.

- (Regressão) Previsão da duração total do processo, visualizado na seção “Alertas" da tabela
- (Regressão) Previsão da duração total de cada fase do processo ( fases 1, 2 e 3), visualizado na tabela “Fases do processo"
- (Classificação) Risco do processo ficar entre os de maior duração (10% de maior duração em dias por natureza do processo)


##Insights Estatísticos

	Foram criadas duas visões com dados processados que indicam o percentual de processos com “movimentos críticos” (movimentos onde processo fica parados por mais de100 dias). Enquanto a primeira visão utiliza como chave o tribunal juntamente com a classe e o assunto, a segunda visão acrescenta o orgão julgador a essa chave, segmentando ainda mais a análise. Para geração do indicador que informa a existência “movimentos críticos” foram considerados apenas as chaves onde o percentual de processos com essa característica era superior a 10%.
	Ao pesquisar por uma NPU que esteja no banco de dados do módulo, o mesmo faz a pesquisa nos dois arquivos previamente processados utilizando as duas chaves de acordo com os dados resgatados do processo, sendo exibidos na seção de alertas juntamente com o percentual informativo caso sejam encontrados.


##Tecnologias utilizadas

	Nesta parte da solução foram utilizadas as seguintes ferramenta/tecnologias:

- KNIME Community version na etapa de ETL dos dados
- Python com Flask & Flask restplus para o serviço RESTFUL com as seguintes bibliotecas adicionais: Pandas e Numpy para manipulação dos dados e scikit learn para os modelos preditivos. Banco de dados embarcado SQLite3.	


##Executando o servidor


	Para a executar apenas o servidor IA isoladamente necessita-se construir a imagem docker existente na pasta ia-server com o seguinte comando:

	docker build —tag <nome da imagem> .

	(Exemplo de comando: "docker build —tag ia-server ." )

	Após a construção da imagem, executar a mesma com o seguinte comando:

	docker run --name <nome_do_conteiner> -p 5000:5000 <nome_da_imagem>

	(Exemplo de comando: "docker run --name servidor-ia -p 5000:5000 ia-server")

	Após a execução do segundo comando o servidor será colocado no ar escutando a porta 5000 exibindo o swagger do serviço na seguinte URL: http://127.0.0.1:5000/.

##Métodos do serviço

- Consulta de processos por NPU

- Cadastro de processo - a desenvolver

- Cadastro de fase de processo - a desenvolver


##Números de processos previamente cadastrados 

As seguintes NPUs estão cadastras previamente no sistema para consulta

109-36.2010.8.17.0900
1321-62.2010.8.26.0052
17268-66.2020.8.17.3088
