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
        resposta = {'mensagem':"", 'resultado':result}
        try:
            resposta['mensagem'] = 'OK'
            resposta['resultado']['processo'] = processo
            retorno = DatabaseController.consultar_processo(processo)
            print(len(retorno))
            if len(retorno) == 0:
                resposta['mensagem'] = "Processo não encontrado"
                return resposta, 404
            else:
                resposta['resultado']['siglaTribunal'] = retorno[0]['sigla_tribunal']
                resposta['resultado']['siglaTribunal'] = retorno[0]['sigla_tribunal']
        except Exception as ex:
            raise ex
        #    resposta['mensagem'] = str(ex)
        #    print(ex)
        #    return resposta, 502
        return resposta, 200

    @staticmethod
    def cadastrar_processo(request):
        return "OK", 200

    # @staticmethod
    # def submeterModelos(request, nome_modelo):
    #     resposta = {'chaves': {}, 'status': "", 'mensagem': ""}
    #     respostas = []
    #     try:
    #         dados = ServiceController.converter_json_entrada(request)
    #         chaves = dados["chaves"]
    #         entradas = dados["entradas"]
    #         unidade = dados["unidade"]
    #         r = RecallAIModelsController()
    #         json_retornos = r.recallModel(chaves, entradas, nome_modelo, unidade)
    #         resposta["chaves"] = chaves
    #         if json_retornos.__len__() > 0:
    #             for retorno in json_retornos:
    #                 modelo = retorno["modelo"]
    #                 resultado = retorno["resultado"]
    #                 respostaModelo = {'nome_modelo': modelo, 'resultado': resultado}
    #                 respostas.append(respostaModelo)
    #                 resposta['resultados'] = respostas
    #             resposta['status'] = "Sucesso"
    #         else:
    #             resposta['status'] = "Erro"
    #             resposta['mensagem'] = "Modelo nao encontrado para a unidade informada"
    #         return resposta, 200
    #     except Exception as ex:
    #         resposta['status'] = "Erro"
    #         resposta['mensagem'] = str(ex)
    #         return resposta, 502
    #
    #
    # @staticmethod
    # def submeterCicloCompleto(request):
    #     resposta = {'chaves': {}, 'status': "", 'mensagem': ""}
    #     respostas = []
    #     try:
    #         dados = ServiceController.converter_json_entrada(request)
    #         #print(dados)
    #         unidade = dados["unidade"]
    #         #print(unidade)
    #         entradas = dados["entradas"]
    #         #print(entradas)
    #         chaves = dados["chaves"]
    #         #print(chaves)
    #         consolidar = dados["consolidar"]
    #         #print(consolidar)
    #         resposta['chaves'] = chaves
    #         nome_arquivo_transformacao = Utils.localizarTransformacaoUnidade(unidade)
    #         nome_arquivo_consolidacao = Utils.localizarConsolidacaoUnidade(unidade)
    #     except Exception as ex:
    #         resposta['status'] = "Erro"
    #         resposta['mensagem'] = str(ex)
    #         print("Erro: " + ex)
    #         return resposta, 502
    #     if nome_arquivo_transformacao != "":
    #         try:
    #             t = TransformDataController()
    #             entradas_processadas = t.transformData(nome_arquivo_transformacao, entradas)
    #             #print(entradas_processadas)
    #         except Exception as ex1:
    #             resposta['status'] = "Erro"
    #             resposta['mensagem'] = str(ex1)
    #             print(ex1)
    #             return resposta, 502
    #         try:
    #             r = RecallAIModelsController()
    #             json_retornos = r.recallModel(chaves, entradas_processadas, "", unidade)
    #             if (consolidar) and (nome_arquivo_consolidacao != ''):
    #                 cons = ConsolidationsController()
    #                 json_retornos = cons.consolidateResults(nome_arquivo_consolidacao, json_retornos)
    #                 #print(json_retornos)
    #             for retorno in json_retornos:
    #                 modelo = retorno["modelo"]
    #                 resultado = retorno["resultado"]
    #                 respostaModelo = {'nome_modelo': modelo, 'resultado': resultado}
    #                 respostas.append(respostaModelo)
    #             resposta['resultados'] = respostas
    #             resposta['status'] = "Sucesso"
    #             return resposta, 200
    #         except Exception as ex2:
    #             resposta['status'] = "Erro"
    #             resposta['mensagem'] = ex2
    #             return resposta, 502
    #     else:
    #         resposta['status'] = "Erro"
    #         resposta['mensagem'] = ""
    #         return resposta, 502
    #
    # @staticmethod
    # def processarArquivo(request):
    #     respostaArquivo = {}
    #     try:
    #         file = request.files['file']
    #         unidade = request.values["unidade"]
    #     except Exception as ex:
    #         respostaArquivo['status'] = "Erro"
    #         return respostaArquivo, 502
    #
    #     if file and ServiceController.arquivo_permitido(file.filename):
    #         filename = file.filename
    #         caminho_inicial = Configs.readConfig(UPLOAD_FOLDER)
    #         caminho = os.path.join(caminho_inicial, filename)
    #         if not os.path.exists(caminho):
    #             try:
    #                 file.save(caminho)
    #             except Exception as ex2:
    #                 print("Erro ao salvar arquivo temporario: " + ex2)
    #
    #     nome_arquivo_extrator = Utils.localizarExtratorUnidade(unidade)
    #
    #     c = DecodeFileController()
    #     pastaProcessamento = Configs.readConfig(UPLOAD_FOLDER_PROCESS)
    #     caminho_inicial = os.path.dirname(os.path.abspath(caminho_inicial))
    #     caminho_pdf = os.path.join(caminho_inicial, pastaProcessamento)
    #     caminho_arquivo = os.path.join(caminho_pdf, filename)
    #     texto = c.ReadFile(nome_arquivo_extrator, caminho_arquivo)
    #
    #     if os.path.exists(caminho):
    #         try:
    #             os.remove(caminho)
    #         except:
    #             print("Erro ao excluir arquivo - " + caminho)
    #     resposta = c.ExtractDataFile(nome_arquivo_extrator, texto)
    #
    #     return resposta, 200
    #
    # @staticmethod
    # def validarArquivo(request):
    #     respostaArquivo = {}
    #     try:
    #         file = request.files['file']
    #         unidade = request.values["unidade"]
    #     except Exception as ex:
    #         respostaArquivo['status'] = "Erro"
    #         return respostaArquivo, 502
    #
    #     if file and ServiceController.arquivo_permitido(file.filename):
    #         filename = file.filename
    #         caminho_inicial = Configs.readConfig(UPLOAD_FOLDER)
    #         caminho = os.path.join(caminho_inicial, filename)
    #         if not os.path.exists(caminho):
    #             try:
    #                 file.save(caminho)
    #             except Exception as ex2:
    #                 print("Erro ao salvar arquivo temporario: " + ex2)
    #     resultado = {
    #         "Valido": False
    #     }
    #
    #     nome_arquivo_extrator = Utils.localizarExtratorUnidade(unidade)
    #     c = DecodeFileController()
    #     pastaProcessamento = Configs.readConfig(UPLOAD_FOLDER_PROCESS)
    #     caminho_inicial = os.path.dirname(os.path.abspath(caminho_inicial))
    #     caminho_pdf = os.path.join(caminho_inicial, pastaProcessamento)
    #     caminho_arquivo = os.path.join(caminho_pdf, filename)
    #     texto = c.ReadFile(nome_arquivo_extrator, caminho_arquivo)
    #
    #     if os.path.exists(caminho):
    #         try:
    #             os.remove(caminho)
    #         except:
    #             print("Erro ao excluir arquivo - " + caminho)
    #
    #     resposta = c.ValidateFile(nome_arquivo_extrator, texto)
    #     if resposta:
    #         resultado = {
    #             "Valido": True
    #         }
    #
    #     return resultado, 200
