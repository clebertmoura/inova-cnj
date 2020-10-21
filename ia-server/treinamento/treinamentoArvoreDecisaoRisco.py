import pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_graphviz
import pickle


def treina_arvore(arquivo_dados, nome_alvo, lista_campos, path, arquivoSaida, separator):

    dados = pd.read_csv(path + arquivo_dados, sep=separator)
    dados_alvo = dados.copy()

    dados_treinamento_x = dados_alvo[lista_campos]
    dados_treinamento_y = dados_alvo[nome_alvo]

    arvore = DecisionTreeClassifier(criterion='entropy', random_state=99)
    arvore.fit(dados_treinamento_x, dados_treinamento_y)

    pickle.dump(arvore, open(path + "modelo_" + arquivoSaida, 'wb'))



treina_arvore(".\Base_para_treinamento_rotulada_v3.csv", "AlvoCDADiferentePJE",
              ['DOCUMENTO_EXECUTADO_IGUAL_CDA_PJE', "AlvoCDADiferentePJE"], "data\\")


