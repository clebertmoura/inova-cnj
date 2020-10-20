import sqlite3
import pickle

from pandas.io.json import json_normalize


class IAController:

    @staticmethod
    def prever_duracao_total(processo_info):
        resultado = 0
        #Carrega o modelo
        modelo = pickle.load(open('../data/modelo_duracao_regressao_duracao.sav', 'rb'))
        # Obtem as informacoes do
        if isinstance(processo_info, dict):
            dados = json_normalize(processo_info)
        else:
            dados = processo_info.copy()
        colunas_x = ['classeProcessual', 'codigoLocalidade',
                     'orgaoJulgador_codigoOrgao', 'assunto_codigoNacional',
                     'mes_ajuizamento']
        alvo_y = ['duracao_dias']
        dummies = ['G1', 'G2', 'JE', 'TR', 'CRIMINAL', 'CIVIL', 'JUIZADOS',
                     'EXECUTIVOS', 'OUTROS', 'PEQUENO', 'MÉDIO', 'GRANDE']

        IAController.ajuste_dummies(dados)

        resultado = modelo.predict(dados[colunas_x + dummies])


        return resultado

    @staticmethod
    def prever_duracao_fase(processo_info, fase):
        resultado = 0
        # Obtem as informacoes do
        if isinstance(processo_info, dict):
            dados = json_normalize(processo_info)
        else:
            dados = processo_info.copy()

        # Carrega o modelo
        if fase == 'F1':
            modelo = pickle.load(open('../data/modelo_duracao_regressao_fase_1.sav', 'rb'))
        elif fase == 'F2':
            modelo = pickle.load(open('../data/modelo_duracao_regressao_fase_2.sav', 'rb'))
        elif fase == 'F3':
            modelo = pickle.load(open('../data/modelo_duracao_regressao_fase_3.sav', 'rb'))

        colunas_x = ['classeProcessual', 'codigoLocalidade',
                     'orgaoJulgador_codigoOrgao', 'assunto_codigoNacional',
                     'mes_ajuizamento']
        alvo_y = ['duracao_' + fase]
        dummies = ['G1', 'G2', 'JE', 'TR', 'CRIMINAL', 'CIVIL', 'JUIZADOS',
                   'EXECUTIVOS', 'OUTROS', 'PEQUENO', 'MÉDIO', 'GRANDE']

        IAController.ajuste_dummies(dados)

        resultado = modelo.predict(dados[colunas_x + dummies])

        return resultado

    @staticmethod
    def classificar(processo_info, arquivo_classificador, campos, alvo, usa_dummies):
        resultado = 0
        # Obtem as informacoes do
        if isinstance(processo_info, dict):
            dados = json_normalize(processo_info)
        else:
            dados = processo_info.copy()

        # Carrega o modelo
        modelo = pickle.load(open(arquivo_classificador, 'rb'))

        colunas_x = ['classeProcessual', 'codigoLocalidade',
                     'orgaoJulgador_codigoOrgao', 'assunto_codigoNacional',
                     'mes_ajuizamento']
        alvo_y = ['duracao_']
        dummies = ['G1', 'G2', 'JE', 'TR', 'CRIMINAL', 'CIVIL', 'JUIZADOS',
                   'EXECUTIVOS', 'OUTROS', 'PEQUENO', 'MÉDIO', 'GRANDE']

        IAController.ajuste_dummies(dados)

        resultado = modelo.predict(dados[colunas_x + dummies])

        return resultado

    @staticmethod
    def ajuste_dummies(dados):
        dados['G1'] = 0
        dados['G2'] = 0
        dados['JE'] = 0
        dados['TR'] = 0
        if dados['grau'][0] == 'G1':
            dados['G1'] = 1
        elif dados['grau'][0] == 'G2':
            dados['G2'] = 1
        elif dados['grau'][0] == 'JE':
            dados['JE'] = 1
        elif dados['grau'][0] == 'TR':
            dados['TR'] = 1

        dados['CRIMINAL'] = 0
        dados['CIVIL'] = 0
        dados['JUIZADOS'] = 0
        dados['EXECUTIVOS'] = 0
        dados['OUTROS'] = 0
        if dados['Natureza'][0] == 'CRIMINAL':
            dados['CRIMINAL'] = 1
        elif dados['Natureza'][0] == 'CIVIL' or dados['Natureza'][0] == 'CIVEL' or dados['Natureza'][0] == 'CÍVEL':
            dados['CIVIL'] = 1
        elif dados['Natureza'][0] == 'JUIZADOS':
            dados['JUIZADOS'] = 1
        elif dados['Natureza'][0] == 'EXECUTIVOS':
            dados['EXECUTIVOS'] = 1
        elif dados['Natureza'][0] == 'OUTROS':
            dados['OUTROS'] = 1

        dados['PEQUENO'] = 0
        dados['MÉDIO'] = 0
        dados['GRANDE'] = 0
        if dados['Porte'][0] == 'PEQUENO':
            dados['PEQUENO'] = 1
        elif dados['Porte'][0] == 'MÉDIO' or dados['Porte'][0] == 'MEDIO':
            dados['MÉDIO'] = 1
        elif dados['Porte'][0] == 'GRANDE':
            dados['GRANDE'] = 1

teste_data = {"processo":"12131231231231",
        "grau":"G1",
        "siglaTribunal":"TJPE",
        "codigoLocalidade":1233,
        "orgaoJulgador_codigoOrgao":"1212",
        "Natureza":"CIVEL",
        "classeProcessual":12323,
        "assunto_codigoNacional":433,
        "mes_ajuizamento":2,
        "Porte":"MÉDIO"}
result = IAController.prever_duracao_total(teste_data)

print(result)

result = IAController.prever_duracao_fase(teste_data, 'F1')

print(result)

result = IAController.prever_duracao_fase(teste_data, 'F2')

print(result)
