# inova-cnj
Projeto elaborado pela equipe do TJPE para Hackathon Inova CNJ

# Preparação dos dados

Efetuar o download do arquivo base.zip disponível em: https://owncloud.app.tjpe.jus.br/index.php/s/qTFibYvDQPoURMH, senha: desafiocnj, e descompactar na pasta ./work.

Para desenvolvimento estamos usando apenas 2 arquivos de cada tribunal estadual.

# Build da imagem Docker

Acessar o sub-diretório: ./ia-core existente no projeto, e então executar o script ./build-image.sh, ou executar o comando abaixo:

> docker build -t ia-core .

# Para iniciar o serviço

No diretório raiz do projeto, executar o comando abaixo:

> docker-compose up -d

# Para acessar os logs do serviço

No diretório raiz do projeto, executar o comando abaixo:

> docker-compose logs -f ia-core

# Para finalizar o serviço

No diretório raiz do projeto, executar o comando abaixo:

> docker-compose down


# BI - Modelagem Dimensional

O projeto contempla uma modelagem dimensional para facilitar a criação de dashboards com indicadores de performance.

## Definição do modelo 

O modelo dimensional está definido no arquivo: ./bi/schema/1-init.sql

