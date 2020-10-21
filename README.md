# EITA - Mais que dados, informação estratégica

Projeto elaborado para Hackathon Inova CNJ, desafio 01.

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

