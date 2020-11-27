# Geração de Clusters

Para o processo de geração dos clusters em função dos orgãos julgadores do conjunto de dados foram utilizadas as informações do acervo( calculado a partir dos processos não baixados presentes nos dados), a classificação do porte do tribunal presente no justiça em números e duas classificações baseadas nos municípios onde os orgãos julgadores estão localizados, obtidos a partir da junção do código da localidade no IBGE com os dados do censo 2010.

Assim, na classificação foi utilizado o algoritmo k-modes que faz o agrupamento em função de variáveis categóricas, a saber: 

  - Classificação dos municípios por população
  - Classificação dos municípios por PIB per capita
  - Classificação dos orgãos julgadores por acervo
  - Classificação por porte do tribunal

Cada processo de geração de clusters foi realizado independentemente para cada tipo de justiça (estadual, federal, eleitoral, militar e trabalho) e para as principais atuações de cada vara com um número mínimo de processos no conjunto de dados (civel, criminal, militar, eleitoral, fazenda, juizados civeis, execuções fiscais, familia e geral - mais de uma atuação)
Após a geração de opções de clusters com variação entre 2 e 8 centroídes, foram escolhidas as configurações que possuíam uma maior média quadrática da diferença entre as durações médias dos proccessos dos clusters. A variável duração média é uma variável independente do processo de clusterização.

Todos os procedimentos de classificação e clusterização foram realizados com o auxílio do da ferramenta KNIME em sua versão Comunnity Edition e de scripts em python, incluídos dentro da subpasta "cluster" da pasta "ia-server"

Segue abaixo as composições dos clusters:

  - Justiça Estadual com atuação cível - 8 clusters
  - Justiça Estadual com atuação criminal - 7 clusters
  - Justiça Estadual com atuação geral - 7 clusters
  - Justiça Federal com atuação civel - 3 clusters
  - Justiça Federal com atuação criminal - 4 clusters
  - Justiça Federal com atuação geral - 8 clusters
  - Justiça Estadual com atuação Fazenda - 8 clusters
  - Justiça Estadual com atuação Execucao fiscal - 8 clusters
  - Justiça Estadual com atuação Trabalho - 5 clusters
  - Justiça Estadual com atuação Juizados civeis - 5 clusters
  - Justiça Estadual com atuação Familia - 3 clusters
  - Justiça Federal com atuação eleitoral - 7 clusters
  - Justiça Militar com atuação militar - 3 clusters
  - Justiça do Trabalho com atuação Trabalho - 7 clusters
  - Justiça Federal com atuação execucao fiscal - 6 clusters
  - Justiça Federal com atuação juizados civeis - 6 clusters

Segue abaixo a composição de cada variável:

# Porte do tribunal

De acordo com a classificação utilizada no justiça em números, classifica os tribunais em 3 categorias - Pequeno, médio e grande porte.

# Classificação por acervo

Para gerar a classificação dos orgãos julgadores por acervo, todos os processos considerados baixados da massa de dados foram eliminados e ocorreu uma contagem do número de processos por orgão julgador. Foram criadas as seguintes clssificações baseadas nos quartis da quantidade de acervo. 

  - Acervo Pequeno - primeiro e menor quartil
  - Acervo médio - segundo e terceiro quartis
  - Acervo grande - quarto e maior quartil

# Classificação por população dos municípios

Para gerar a classificação por população dos municípios, foi realizado o cruzamento dos códigos de localidade presentes nos dados dos orgãos julgadores com os dados do censo 2010. Foi utilizada a seguinte classificação, encontrada em alguns artigos:

  - Município de Pequeno porte - Até 25 mil habitantes
  - Município de Médio porte - Entre 25 mil e 100 mil habitantes
  - Município de Grande porte - Acima de 100 mil habitantes

# Classificação por PIB per capita dos municípios

Para gerar a classificação por PIB per capita dos municípios, foi realizado o cruzamento dos códigos de localidade presentes nos dados dos orgãos julgadores com os dados do censo 2010. Foi utilizada a seguinte classificação, encontrada em alguns artigos:

  - Municípios de Baixo PIB per capita - primeiro e menor quartil
  - Municípios de Médio PIB per capita - segundo e terceiro quartis
  - Municípios de Alto PIB per capita - quarto e maior quartil

# Atuação da vara

Para cada processo de cada orgão julgador presente no conjunto de dados, foi verificado a partir de sua classe processual a qual conjunto esse processo pertencia. Após esse processamento, todas as categorias foram somadas e a presença de uma ou mais dessas categorias foi agrupada de acordo com asua quantidade em uma das classificações de atuação existente com o auxílio e análise dos membros da equipe com conhecimento do direito. Quando era evidente que uma vara atuava em mais de uma competência de forma consistente, essa vara era classificada como "Geral". Seguem as categorias:

  - Civel
  - Criminal
  - Militar
  - Eleitoral
  - Fazenda
  - Juizados civeis
  - Execuções fiscais
  - Familia
  - Geral
