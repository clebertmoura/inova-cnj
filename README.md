# inova-cnj
Projeto elaborado pela equipe do TJPE para Hackathon Inova CNJ

# Preparação dos dados

Efetuar o download do arquivo base.zip disponível em: https://owncloud.app.tjpe.jus.br/index.php/s/qTFibYvDQPoURMH, senha: desafiocnj, e descompactar na pasta ./work.

Para desenvolvimento estamos usando apenas 2 arquivos de cada tribunal estadual.

# Para iniciar o serviço

> docker-compose up -d

# Para acessar os logs do serviço

> docker-compose logs -f ia-core

# Para finalizar o serviço

> docker-compose down