import os
import json
import pandas as pd
import numpy as np
from coreELIS.Configs import Configs
from xml.dom import minidom


class Utils:

    @staticmethod
    def esta_contido(lista_inicial, lista_total):
        resultado = False
        contador = 0
        for elem1 in lista_inicial:
            for elem2 in lista_total:
                if elem1 == elem2:
                    contador = contador + 1

        if contador == len(lista_inicial):
            resultado = True

        return resultado

    @staticmethod
    def localizarExtratorUnidade(unidade):
        path = Configs.readConfig("DataFolder")
        path_config = os.path.join(path, Configs.readConfig("ExtratorsData"))
        with open(path_config) as conf:
            dados = json.load(conf)
        arquivo_extrator_retorno = ''
        for e in dados["Extratores"]:
            arquivo_extrator = e['Arquivo']
            unidades_extrator = e['Unidades']
            for unid in unidades_extrator:
                nome_unidade = unid
                if unidade == nome_unidade:
                    arquivo_extrator_retorno = arquivo_extrator
        return arquivo_extrator_retorno

    @staticmethod
    def localizarTransformacaoUnidade(unidade):
        path = Configs.readConfig("DataFolder")
        path_config = os.path.join(path, Configs.readConfig("TransformationsData"))
        with open(path_config) as conf:
            dados = json.load(conf)
        arquivo_transformacao_retorno = ''
        for e in dados['Transformacoes']:
            arquivo_transformacao = e['Arquivo']
            unidades_transformacao = e['Unidades']
            for unid in unidades_transformacao:
                nome_unidade = unid
                if unidade == nome_unidade:
                    arquivo_transformacao_retorno = arquivo_transformacao
        return arquivo_transformacao_retorno

    @staticmethod
    def localizarConsolidacaoUnidade(unidade):
        path = Configs.readConfig("DataFolder")
        path_config = os.path.join(path, Configs.readConfig("ConsolidationsData"))
        with open(path_config) as conf:
            dados = json.load(conf)
        for e in dados["Consolidacoes"]:
            arquivo_consolidacao = e['Arquivo']
            unidades_consolidacao = e['Unidades']
            for unid in unidades_consolidacao:
                nome_unidade = unid
                if unidade == nome_unidade:
                    arquivo_consolidacao_retorno = arquivo_consolidacao

        return arquivo_consolidacao_retorno

    @staticmethod
    def localizarModelosUnidade(unidade):
        modelos = []
        path = Configs.readConfig("DataFolder")
        path_config = os.path.join(path, Configs.readConfig("ModelsData"))
        with open(path_config) as conf:
            dados = json.load(conf)
        for e in dados["Modelos"]:
            nome_modelo = e['Nome']
            arquivo_modelo = e['Arquivo']
            unidades_modelo = e['Unidades']
            tipo_modelo = e['Tipo']
            campos = e['Campos']
            for unid in unidades_modelo:
                nome_unidade = unid
                if unidade == nome_unidade or unidade == '':
                    modelo = {
                        'Nome': nome_modelo,
                        'Arquivo': arquivo_modelo,
                        'Tipo': tipo_modelo,
                        'Campos': []
                    }
                    lista_campos = []
                    for c in campos:
                        lista_campos.append(c)
                    modelo['Campos'] = lista_campos
                    modelos.append(modelo)

        return modelos

    @staticmethod
    def localizarArquivosAdicionais(unidade, modelo):
        arquivos_adicionais = pd.DataFrame(data=None, columns=["Tipo","Arquivo"])
        path = Configs.readConfig("DataFolder")
        path_config = os.path.join(path, Configs.readConfig("AditionalFilesData"))
        with open(path_config) as conf:
            dados = json.load(conf)
        for e in dados["Adicionais"]:
            nome_modelo = e['Modelo']
            arquivos = e['Arquivos']
            unidades_modelo = e['Unidades']
            for unid in unidades_modelo:
                nome_unidade = unid
                if (unidade == nome_unidade or unidade == '') and (modelo == nome_modelo):
                    for arquivos_adic in arquivos:
                        arq_adic = {
                            "Tipo": arquivos_adic["Tipo"],
                            "Arquivo": arquivos_adic["Nome"],
                        }

                        arquivos_adicionais = arquivos_adicionais.append(arq_adic, ignore_index=True)
        return arquivos_adicionais

    @staticmethod
    def levenshtein_ratio_and_distance(s, t, ratio_calc=False):
        """ levenshtein_ratio_and_distance:
            Calculates levenshtein distance between two strings.
            If ratio_calc = True, the function computes the
            levenshtein distance ratio of similarity between two strings
            For all i and j, distance[i,j] will contain the Levenshtein
            distance between the first i characters of s and the
            first j characters of t
        """
        # Initialize matrix of zeros
        rows = len(s) + 1
        cols = len(t) + 1
        distance = np.zeros((rows, cols), dtype=int)

        # Populate matrix of zeros with the indeces of each character of both strings
        for i in range(1, rows):
            for k in range(1, cols):
                distance[i][0] = i
                distance[0][k] = k

        # Iterate over the matrix to compute the cost of deletions,insertions and/or substitutions
        for col in range(1, cols):
            for row in range(1, rows):
                if s[row - 1] == t[col - 1]:
                    cost = 0  # If the characters are the same in the two strings in a given position [i,j] then the cost is 0
                else:
                    # In order to align the results with those of the Python Levenshtein package, if we choose to calculate the ratio
                    # the cost of a substitution is 2. If we calculate just distance, then the cost of a substitution is 1.
                    if ratio_calc == True:
                        cost = 2
                    else:
                        cost = 1
                distance[row][col] = min(distance[row - 1][col] + 1,  # Cost of deletions
                                         distance[row][col - 1] + 1,  # Cost of insertions
                                         distance[row - 1][col - 1] + cost)  # Cost of substitutions
        if ratio_calc == True:
            # Computation of the Levenshtein Distance Ratio
            Ratio = ((len(s) + len(t)) - distance[row][col]) / (len(s) + len(t))
            return Ratio
        else:
            # print(distance) # Uncomment if you want to see the matrix showing how the algorithm computes the cost of deletions,
            # insertions and/or substitutions
            # This is the minimum number of edits needed to convert string a to string b
            return "The strings are {} edits away".format(distance[row][col])