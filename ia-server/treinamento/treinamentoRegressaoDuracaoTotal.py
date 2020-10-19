import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score,mean_squared_error
import pickle


def treina_random_duracao_total(path):

    colunas_x = ['classeProcessual','codigoLocalidade',
                 'orgaoJulgador_codigoOrgao','assunto_codigoNacional',
                 'mes_ajuizamento','G1','G2','JE','TR','CRIMINAL','CIVIL','JUIZADOS',
                 'EXECUTIVOS','OUTROS','PEQUENO','MÉDIO','GRANDE']
    alvo_y = ['duracao_dias']
    dados_treinamento = pd.read_csv('../data/massa_treinamento_regressao_duracao.csv', sep =';')
    dados_treinamento_x = dados_treinamento[colunas_x]
    dados_treinamento_y = dados_treinamento[alvo_y]

    #dados_teste = pd.read_csv('../data/massa_teste_regressao_duracao.csv', sep=';')
    #dados_teste_y = dados_teste[alvo_y]
    #dados_teste_y = dados_teste_y[:None]
    #x = np.array(dados_treinamento_x)
    #y = np.array(dados_teste_y)
    #print(dados_treinamento_x)
    #print(dados_teste_y)

    random_forest_regression = RandomForestRegressor()
    #random_forest_regression.fit(dados_treinamento_x[:, colunas_x], dados_teste_y.iloc[:,alvo_y])
    random_forest_regression.fit(dados_treinamento_x.to_numpy(), dados_treinamento_y.to_numpy())

    pickle.dump(random_forest_regression, open(path + "/modelo_duracao_regressao_durecao.sav", 'wb'))

treina_random_duracao_total('../data/')

