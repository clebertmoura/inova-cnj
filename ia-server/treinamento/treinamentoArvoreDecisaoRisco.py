from __future__ import print_function
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_graphviz
import pydotplus
import pickle


def treina_arvore(nome_modelo, arquivo_dados, nome_alvo, lista_campos, path):

    dados = pd.read_csv(path + arquivo_dados, sep=',', encoding='ANSI')
    dados_alvo = dados.copy()

    #Ordena a lista de campos
    lista_campos.sort(key=str.lower)

    index = lista_campos.index(nome_alvo)
    lista_sem_alvo = lista_campos
    del lista_sem_alvo[index]

    treinamento = dados_alvo[lista_campos]
    alvo = dados_alvo[nome_alvo]
    arvore = DecisionTreeClassifier(criterion='entropy', random_state=99)
    arvore.fit(treinamento, alvo)

    dot_data = export_graphviz(arvore, out_file=None, feature_names=lista_campos,
                filled=True, rounded=True, special_characters=True, class_names=arvore.classes_)
    graph = pydotplus.graph_from_dot_data(dot_data)
    graph.write_pdf(path + "modelo_" + nome_modelo + ".pdf")
    #Salva o modelo
    pickle.dump(arvore, open(path + "modelo_" + nome_modelo + ".sav", 'wb'))


#treina_arvore("Espolio", ".\Base_para_treinamento_rotulada.csv", "AlvoEspolio",
#              ['CDA_SERIE_IMOBILIARIA', 'POSSUI_TERMO_ESPOLIO', 'CDA_NOME_VAZIO', 'AlvoEspolio'], "data\\")

#treina_arvore("AnalisarPrescricao", ".\Base_para_treinamento_rotulada.csv", "AlvoAnalisarPrescricao",
#              ['CDA_SERIE_IMOBILIARIA', 'POSSUI_TERMO_ESPOLIO','DIFERENCA_MENOR_EXERCICIO_IGUAL_OU_MAIOR_5',
#                  'DIFERENCA_MAIOR_EXERCICIO_IGUAL_OU_MAIOR_5', 'AlvoAnalisarPrescricao'], "data\\")

treina_arvore("FazendaEstadual", "Base_para_treinamento_rotulada_v2.csv", "AlvoFazendaEstadual",
              ['QTD_IPTU', 'POSSUI_REF_PERNAMBUCO','POSSUI_REF_SECRETARIA',
                  'QTD_TLP', 'DOCUMENTO_EXECUTADO_IGUAL_CDA_PJE', 'INDICA_NOME_COMUM_FAZ_ESTADUAL',
               "AlvoFazendaEstadual"], "D:\\ELIS_2\\treinamento_modelos\\")

#treina_arvore("JusticaFederal", ".\Base_para_treinamento_rotulada_v3.csv", "AlvoJusticaFederal",
#              ['QTD_TLP', 'INDICA_NOME_COMUM_JUSTICA_FEDERAL', 'POSSUI_TERMO_FEDERAL', 'INICIA_COM_TERMO_MINISTERIO',
#               "AlvoJusticaFederal"], "data\\")

#treina_arvore("CDAComErro", ".\Base_para_treinamento_rotulada_v3.csv", "AlvoCDAComErro",
#              ['CDA_NOME_VAZIO', "AlvoCDAComErro"], "data\\")

#treina_arvore("CDADiferentePJE", ".\Base_para_treinamento_rotulada_v3.csv", "AlvoCDADiferentePJE",
#              ['DOCUMENTO_EXECUTADO_IGUAL_CDA_PJE', "AlvoCDADiferentePJE"], "data\\")


