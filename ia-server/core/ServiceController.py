import json
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")
from core.DatabaseController import DatabaseController


class ServiceController:

    @staticmethod
    def converter_json_entrada(request):
        dados = request.get_json()
        if type(dados) == str:
            data = json.loads(dados)
        else:
            data = dados
        return data

    @staticmethod
    def consultar_processo(request, processo):
        result = {}
        hist_fases = []
        histf = {'nome':"", 'situacao':"", 'dataInicio':"", 'dataConclusao':"" }
        dados_fases = []
        dadof = {'id':"", 'duracao':-1, 'duracaoPrevista':-1, 'status':""}
        resposta = {'mensagem':"", 'resultado':result}
        alertas = []
        alerta = {'nome':"", 'valor':""}
        try:
            resposta['mensagem'] = 'OK'
            resposta['resultado']['processo'] = processo
            retorno = DatabaseController.consultar_processo(processo)
            if len(retorno) == 0:
                resposta['mensagem'] = "Processo não encontrado"
                return resposta, 404
            else:
                resposta['resultado']['siglaTribunal'] = retorno[0]['sigla_tribunal']
                resposta['resultado']['orgaoJulgador'] = retorno[0]['orgao_julgador']
                resposta['resultado']['Natureza'] = retorno[0]['natureza']
                resposta['resultado']['classe'] = retorno[0]['sigla_tribunal']
                resposta['resultado']['assunto'] = retorno[0]['assunto']
                resposta['resultado']['dataAjuizamento'] = retorno[0]['dh_ajuizamento']
                resposta['resultado']['porteTribunal'] = retorno[0]['porte_tribunal']
                mes_ajuizamento = retorno[0]['mes_ajuizamento']
                codigo_localidade = retorno[0]['codigo_localidade']
                #Consulta as fases
                ret_hist_fases = DatabaseController.consultar_processo_fase(processo)
                if len(ret_hist_fases) > 0:
                    for reg in ret_hist_fases:
                        histf['nome'] = reg['nome_fase']
                        histf['situacao'] = reg['status_fase']
                        histf['dataInicio'] = reg['dt_inicio']
                        histf['dataConclusao'] = reg['dt_fim']
                        hist_fases.append(histf.copy())
                        dadof['id'] = reg['id_fase']
                        dadof['duracao'] = reg['duracao']
                        dadof['status'] = reg['status_fase']
                        prev = 0
                        #Vai no modelo buscar a previsão
                        dadof['duracaoPrevista'] = prev
                        dados_fases.append(dadof.copy())
                    resposta['resultado']['historicoFases'] = hist_fases
                    resposta['resultado']['dadosFases'] = dados_fases
                alerta['nome'] = 'Duração total estimada do processo'
                alerta['valor'] = '1452 dias'
                alertas.append(alerta.copy())
                alerta['nome'] = 'Classificação quanto a possibilidade de duração muito acima do normal'
                alerta['valor'] = 'Alta possibilidade'
                alertas.append(alerta.copy())
                alerta['nome'] = 'Possibilidade de duração muito abaixo do normal'
                alerta['valor'] = 'Duração Normal'
                alertas.append(alerta.copy())
                resposta['resultado']['alertas'] = alertas


        except Exception as ex:
            resposta['mensagem'] = str(ex)
            return resposta, 502
            #raise ex
        return resposta, 200

    @staticmethod
    def cadastrar_processo(request):
        return "OK", 200

