import json
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")
from core.DatabaseController import DatabaseController
from core.IAController import IAController

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
        proposta_ia = {"processo":"", "grau":"", "siglaTribunal":"", "codigoLocalidade":0,
        "orgaoJulgador_codigoOrgao":"", "Natureza":"", "classeProcessual":0,
        "assunto_codigoNacional":0, "mes_ajuizamento":0, "Porte":""}
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
                resposta['resultado']['natureza'] = retorno[0]['natureza']
                resposta['resultado']['classe'] = retorno[0]['classe']
                resposta['resultado']['assunto'] = retorno[0]['assunto']
                resposta['resultado']['dataAjuizamento'] = retorno[0]['dh_ajuizamento']
                resposta['resultado']['porteTribunal'] = retorno[0]['porte_tribunal']
                cod_assunto = retorno[0]['cod_assunto']
                cod_classe = retorno[0]['cod_classe']
                cod_orgao_julgador = retorno[0]['cod_orgao_julgador']
                grau = retorno[0]['grau']
                mes_ajuizamento = retorno[0]['mes_ajuizamento']
                codigo_localidade = retorno[0]['codigo_localidade']
                #Monta prposta para submissão aos modelos
                proposta_ia['processo'] = processo
                proposta_ia['grau'] = grau
                proposta_ia['siglaTribunal'] = retorno[0]['sigla_tribunal']
                proposta_ia['codigoLocalidade'] = codigo_localidade
                proposta_ia['orgaoJulgador_codigoOrgao'] = cod_orgao_julgador
                proposta_ia['Natureza'] = retorno[0]['natureza']
                proposta_ia['classeProcessual'] = cod_classe
                proposta_ia['assunto_codigoNacional'] = cod_assunto
                proposta_ia['mes_ajuizamento'] = mes_ajuizamento
                proposta_ia['Porte'] = retorno[0]['porte_tribunal']

                #Consulta as fases
                ret_hist_fases = DatabaseController.consultar_processo_fase(processo)
                if len(ret_hist_fases) > 0:
                    for reg in ret_hist_fases:
                        nome_fase = reg['nome_fase']
                        histf['nome'] = nome_fase
                        histf['situacao'] = reg['status_fase']
                        histf['dataInicio'] = reg['dt_inicio']
                        histf['dataConclusao'] = reg['dt_fim']
                        hist_fases.append(histf.copy())
                        dadof['nome'] = nome_fase
                        duracao = reg['duracao']
                        duracao_str = str(reg['duracao']) + ' dias'
                        if duracao < 0:
                            duracao_str = ""
                        dadof['duracao'] = duracao_str
                        dadof['status'] = reg['status_fase']
                        prev = 0
                        #Chama o modelo
                        print('Chamada ao modelo - Duração da fase')
                        print(proposta_ia)
                        print(nome_fase)
                        prev = IAController.prever_duracao_fase(proposta_ia.copy(), nome_fase)
                        dadof['duracaoPrevista'] = str(prev) + ' dias'
                        dados_fases.append(dadof.copy())
                    resposta['resultado']['historicoFases'] = hist_fases
                    resposta['resultado']['dadosFases'] = dados_fases
                alerta['nome'] = 'Duração total estimada do processo'
                previsaoDuracaoTotal = 0
                previsaoDuracaoTotal = IAController.prever_duracao_total(proposta_ia.copy())
                alerta['valor'] = str(previsaoDuracaoTotal) + ' dias'
                alertas.append(alerta.copy())
                class_demora = IAController.classificar(proposta_ia.copy())
                alerta['nome'] = 'Classificação quanto a possibilidade de duração muito acima do normal'
                if class_demora[0] == 'DEMORADO':
                    class_demora_str = 'Alta probabilidade de demora'
                else:
                    class_demora_str = 'Baixa probabilidade de demora'
                alerta['valor'] = class_demora_str
                alertas.append(alerta.copy())

                possui_mov_crit_1, pct_mov_crit_1 = IAController.possui_hist_mov_critico_trib_classe_assunto(proposta_ia)
                print(possui_mov_crit_1)
                print(round(pct_mov_crit_1 * 100,2))
                if possui_mov_crit_1:
                    alerta['nome'] = 'Para o mesmo tribunal, classe e assunto deste processo existem outros com movimentações críticas no percentual de'
                    alerta['valor'] = str(round(pct_mov_crit_1 * 100,2)) + ' %'
                    alertas.append(alerta.copy())

                possui_mov_crit_2, pct_mov_crit_2 = IAController.possui_hist_mov_critico_trib_orgao_classe_assunto(
                    proposta_ia)
                print(possui_mov_crit_2)
                print(round(pct_mov_crit_2 * 100, 2))
                if possui_mov_crit_2:
                    alerta[
                        'nome'] = 'Para o mesmo tribunal, orgão julgador, classe e assunto deste processo existem outros com movimentações críticas no percentual de'
                    alerta['valor'] = str(round(pct_mov_crit_2 * 100, 2)) + ' %'
                    alertas.append(alerta.copy())
                resposta['resultado']['alertas'] = alertas


        except Exception as ex:
            #resposta['mensagem'] = str(ex)
            #return resposta, 502
            raise ex
        return resposta, 200

    @staticmethod
    def cadastrar_processo(request):
        return "OK", 200

