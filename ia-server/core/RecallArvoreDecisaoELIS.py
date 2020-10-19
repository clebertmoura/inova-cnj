from __future__ import print_function
import pickle
from coreELIS.Utils import Utils
from pandas.io.json import json_normalize

class RecallArvoreDecisaoELIS:

    @staticmethod
    def recallDecisionTree(arquivo_modelo, lista_campos_modelo, entradas):
        modelo = pickle.load(open(arquivo_modelo, 'rb'))
        if isinstance(entradas, dict):
            dados = json_normalize(entradas)
        else:
            dados = entradas.copy()
        lista_campos = list(dados)
        lista_campos.sort(key=str.lower)
        if Utils.esta_contido(lista_campos_modelo, lista_campos):
            result = modelo.predict(dados[lista_campos_modelo])
            #del modelo
        else:
            result = ["Error"]
        return result[0]



