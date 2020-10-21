import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score,mean_squared_error
import pickle


def treina_random_duracao_total(path, colunas, alvo):

    dados_treinamento = pd.read_csv('../data/massa_treinamento_regressao_duracao.csv', sep =';')
    dados_treinamento_x = dados_treinamento[colunas]
    dados_treinamento_y = dados_treinamento[alvo]

    random_forest_regression = RandomForestRegressor()
    random_forest_regression.fit(dados_treinamento_x.to_numpy(), dados_treinamento_y.to_numpy())

    pickle.dump(random_forest_regression, open(path + "modelo_duracao_regressao_duracao.sav", 'wb'))

def treina_random_duracao(path, arquivo_dados, colunas, alvo, arquivo_destino, separator):

    dados_treinamento = pd.read_csv(path + arquivo_dados, sep=separator)
    dados_treinamento_x = dados_treinamento[colunas]
    dados_treinamento_y = dados_treinamento[alvo]

    random_forest_regression = RandomForestRegressor()
    random_forest_regression.fit(dados_treinamento_x.to_numpy(), dados_treinamento_y.to_numpy())

    pickle.dump(random_forest_regression, open(path + arquivo_destino, 'wb'))


colunas_x = ['classeProcessual','codigoLocalidade',
                 'orgaoJulgador_codigoOrgao','assunto_codigoNacional',
                 'mes_ajuizamento','G1','G2','JE','TR','CRIMINAL','CIVIL','JUIZADOS',
                 'EXECUTIVOS','OUTROS','PEQUENO','MÉDIO','GRANDE']

#treina_random_duracao_total('../data/')

#treina_random_duracao('../data/', 'dados_treinamento_regressao_F1.csv', colunas_x, ['duracao_F1'],
#                      'modelo_duracao_regressao_fase_1.sav', ';')


#treina_random_duracao('../data/', 'dados_treinamento_regressao_F2.csv', colunas_x, ['duracao_F2'],
#                      'modelo_duracao_regressao_fase_2.sav', ';')

#treina_random_duracao('../data/', 'dados_treinamento_regressao_F3.csv', colunas_x, ['duracao_F3'],
#                      'modelo_duracao_regressao_fase_3.sav', ';')
