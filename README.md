# inova-cnj

Projeto elaborado pela equipe do TJPE para Hackathon Inova CNJ no Desafio 01.

## Tecnologias utilizadas

- Docker
- Python 3
- Jupyter
- Apache Spark 3.0.1 (pyspark)
- Postgres 10
- Metabase 0.36

## Arquitetura e módulos do projeto

- *ia-core*
> Módulo principal que realiza o processamento dos dados e tratamento. Também é responsável pela implementação dos modelos preditivos.

- *backend*
> Módulo backend onde são implementadas as regras de negócio e que disponibiliza as APIs

- *bi*
> Projeto que contem os artefatos do modelo dimensional

## Preparação dos dados

Efetuar o download do arquivo base.zip disponível em: https://owncloud.app.tjpe.jus.br/index.php/s/qTFibYvDQPoURMH, senha: desafiocnj, e descompactar na pasta ./work.

Para desenvolvimento estamos usando apenas 2 arquivos de cada tribunal estadual.

## Efetuando o build da imagem Docker

Antes de iniciar o ambiente, é necessário buildar a imagem docker do modulo *ia-core*. 
Para isso, utilize um terminal e acesse o sub-diretório: `./ia-core`, em seguida execute o comando abaixo:

> docker build -t ia-core .

## Iniciando o ambiente

Para executar localmente, é necessário que o docker local estaja com o swarm manager ativado, para isso, execute o comando abaixo:

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

Para acessar a console do jupyter

http://127.0.0.1:8888/?token=adcd2bc95167732e71741f5e9f15cbb9d097013840c66d8b

# BI - Modelagem Dimensional

O projeto contempla uma modelagem dimensional para facilitar a criação de dashboards com indicadores de performance.

## Definição do modelo 

O modelo dimensional está definido no arquivo: ./bi/schema/1-init.sql

