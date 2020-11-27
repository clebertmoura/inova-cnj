import numpy as np
import pandas as pd
from kmodes.kmodes import KModes
from kmodes.kprototypes import KPrototypes

# random categorical data
#data = np.random.choice(20, (100, 10))
#dados = pd.read_csv('analise_clusters.csv', sep=";")
dados = pd.read_csv('duracao_em_funcao_de_todas_as_variaveis_v2_com_filtro_quartis.csv', sep=';')
#colunas = ["grau","NATUREZA","duracao_dias","Porte","Estratificacao","RM_OU_RIDE","Atuacao_Vara"]
colunas = ["duracao_dias","Porte","Estratificacao","RM_OU_RIDE","Atuacao_Vara"]
#colunas_cat_ = ["grau","NATUREZA","Porte","Estratificacao","RM_OU_RIDE","Atuacao_Vara"]
colunas_cat_ = ["Porte","Estratificacao","RM_OU_RIDE","Atuacao_Vara"]
#colunas_cat = [0, 1, 3, 4, 5, 6]
colunas_cat = [1, 2, 3, 4]

dados = dados.filter(items=colunas)
dados['duracao_dias'] = pd.to_numeric(dados['duracao_dias'])
print(dados.head(10))
print(dados.dtypes)

#km = KModes(n_clusters=6, init='Huang', n_init=10, verbose=1)

km = KPrototypes(n_clusters=6, init='Huang', n_init=2, verbose=1)

print(dados.shape[1])



dados_temp = dados[colunas_cat_]

print(dados_temp)

clusters = km.fit_predict(dados, categorical=colunas_cat)

#clusters = km.fit_predict(dados)

# Print the cluster centroids
print('Centroídes')
print(km.cluster_centroids_)

print('Clusters')
print(clusters)
