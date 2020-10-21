import pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_graphviz
import pickle


def treina_arvore(arquivo_dados, nome_alvo, lista_campos, path, arquivoSaida, separator):

    dados = pd.read_csv(path + arquivo_dados, sep=separator)
    dados = dados.fillna(0)
    dados_alvo = dados.copy()

    dados_treinamento_x = dados_alvo[lista_campos]
    dados_treinamento_y = dados_alvo[nome_alvo]

    arvore = DecisionTreeClassifier(criterion='entropy', random_state=99)
    arvore.fit(dados_treinamento_x, dados_treinamento_y)

    pickle.dump(arvore, open(path + arquivoSaida, 'wb'))

colunas_x = ['classeProcessual','codigoLocalidade',
                'orgaoJulgador_codigoOrgao', 'assunto_codigoNacional',
                 'mes_ajuizamento','G1','G2','JE','TR','CRIMINAL','CIVIL','JUIZADOS',
                 'EXECUTIVOS','OUTROS','PEQUENO','MÉDIO','GRANDE']

treina_arvore("dados_treinamento_classificacao_mais_demorados.csv", "alvo_processos_demorados",
              colunas_x, "../data/", 'modelo_class_proc_mais_demorados.sav',';')


