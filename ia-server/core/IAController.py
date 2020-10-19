import sqlite3
import pickle

from pandas.io.json import json_normalize


class IAController:

    @staticmethod
    def prever_duracao_total(processo_info):
        resultado = 0
        #Carrega o modelo
        modelo = pickle.load(open('../data/modelo_duracao_regressao_durecao.sav', 'rb'))
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
        #dados['G1'] = 0

        if dados['grau'][0] == 'G1':
            dados['G1'] = 1
            dados['G2'] = 0
            dados['JE'] = 0
            dados['TR'] = 0
        elif dados['grau'][0] == 'G2':
            dados['G1'] = 0
            dados['G2'] = 1
            dados['JE'] = 0
            dados['TR'] = 0
        elif dados['grau'][0] == 'JE':
            dados['G1'] = 0
            dados['G2'] = 0
            dados['JE'] = 1
            dados['TR'] = 0
        elif dados['grau'][0] == 'TR':
            dados['G1'] = 0
            dados['G2'] = 0
            dados['JE'] = 0
            dados['TR'] = 1

        dados['CRIMINAL'] = 0
        dados['CIVIL'] = 1
        dados['JUIZADOS'] = 0
        dados['EXECUTIVOS'] = 0
        dados['OUTROS'] = 0
        dados['PEQUENO'] = 0
        dados['MÉDIO'] = 0
        dados['GRANDE'] = 0

        resultado = modelo.predict(dados[colunas_x + dummies])


        return resultado

teste_data = {"processo":"12131231231231",
        "grau":"G1",
        "siglaTribunal":"TJPE",
        "codigoLocalidade":1233,
        "orgaoJulgador_codigoOrgao":"1212",
        "Natureza":"CIVIL",
        "classeProcessual":12323,
        "assunto_codigoNacional":433,
        "mes_ajuizamento":2,
        "Porte":"MÉDIO"}
result = IAController.prever_duracao_total(teste_data)

print(result)

