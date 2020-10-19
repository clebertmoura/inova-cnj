from django.http import JsonResponse
from IAHackathonServer.service.models import Resposta, RespostaModelo
from django.core import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from coreELIS.serializers import RespostaSerializer
from coreELIS.RecallArvoreDecisaoELIS import *
from rest_framework.parsers import FileUploadParser
from rest_framework.parsers import MultiPartParser
from rest_framework.exceptions import ParseError
from rest_framework.views import APIView
from django.conf.urls import url
from rest_framework_swagger.views import get_swagger_view
from . import DecodePDF
from . import ProcessInfo
import simplejson as json
import logging
import tempfile
import os

logger = logging.getLogger(__name__)

schema_view = get_swagger_view(title='Elis API')

urlpatterns = [
    url(r'^$', schema_view)
]

@api_view(['POST'])
@permission_classes((AllowAny, ))
def submete_modelo(request):

    print(request.body)
    logger.info('Host: ' + request.get_host())
    print(logger)

    entradas = request.data

    entrada_npu = entradas["NPU"]
    entrada_cda = entradas["CDA"]

    # print(entradas_merge["POSSUI_TERMO_ESPOLIO"][0])

    resposta = Resposta(npu=entrada_npu, cda=entrada_cda)
    # print(resposta)
    # submete ao modelo
    serializer = None
    respostas = []
    try:

        json_retornos = recall_arvore_config(entradas)
        for retorno in json_retornos:
            #j = json.dumps(retorno)
            #npu = retorno["npu"]
            #cda = retorno["cda"]
            modelo = retorno["modelo"]
            resultado = retorno["resultado"]
            respostaModelo = RespostaModelo(nome_modelo=modelo, resultado=resultado)
            respostas.append(respostaModelo)
            #serializer = RespostaSerializer(respostas, many=True)
        #return Response(serializer.data, status=status.HTTP_200_OK)
        resposta.resultados = respostas
        resposta.status = "Sucesso"
        serializer = RespostaSerializer(resposta, many=False)
        # print(resposta.resultados)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as ex:
        resposta = Resposta(status='Erro', mensagem=ex)
        print(ex)
        serializer = RespostaSerializer(resposta)
        return Response(serializer.data, status=status.HTTP_502_BAD_GATEWAY)



    #return serializers.serialize('json', response_data)
    #return JsonResponse(response_data)

    #return HttpResponse(result, content_type="application/json")

@api_view(['POST'])
@permission_classes((AllowAny, ))
def submete_arquivo_CDA(request):
    parser_class = (FileUploadParser,)
    if 'file' not in request.data:
        raise ParseError("Empty content")

    f = request.data['file']
    #with tempfile.mkstemp() as tmpFile:
    #    tmpFile.write(f.raw)
    #    texto = DecodePDF.DecodePDF.ReadPDFTika(tmpFile)

    tmp = tempfile.NamedTemporaryFile(suffix='.pdf', delete=False)
    try:
        f.open('rb')
        for chunk in f.chunks():
            tmp.write(chunk)
    finally:
        f.close()
    tmp.flush()
    tmp.close()
    print(tmp.name)
    texto = DecodePDF.DecodePDF.ReadPDFTika(tmp.name)
    #time.sleep(15)
    if os.path.exists(tmp.name):
        os.remove(tmp.name)


    resposta = DecodePDF.DecodePDF.ExtractDataPDFTika(texto)

    #print(resposta)

    resultado = ProcessInfo.ProcessInfo.tratamentoVariaveisPDF(resposta)

    return Response(resultado)


def submete_modelo_teste(request):
    result = []


    #Faz o processamento
    #resposta_obj = Resposta(modelo="Executivos_Fiscais_Recife", npu="123123123", cda="1111111", resultado="OK")
    #result.append(resposta_obj)

    result.append(Resposta(modelo="Executivos_Fiscais_Recife", npu="123123123", cda="1111111", resultado="OK"))
    result.append(Resposta(modelo="Executivos_Fiscais_Recife", npu="122322232", cda="2222222", resultado="ESPOLIO"))

    response_data = {}
    try:
        response_data['result'] = 'Success'
        response_data['message'] = serializers.serialize('json', result)
    except:
        response_data['result'] = 'Ouch!'
        response_data['message'] = 'Script has not ran correctly'


    return JsonResponse(response_data)

    #return HttpResponse(result, content_type="application/json")

@api_view(['POST'])
@permission_classes((AllowAny, ))
def submete_modeloExecutivosFiscaisRecife(request):
    #Recebe dois jsons, do Pje e outro da CDA-PDF

    entradas = request.data
    if isinstance(entradas, str):
        data = json.loads(entradas)
    else:
        data = entradas.copy()

    entradas_pje = data["dadosPje"]
    entradas_pje = ProcessInfo.ProcessInfo.tratamentoVariaveisPje(entradas_pje)
    #print(entradas_pje)
    entradas_cda = data["dadosCDA"]
    entradas_cda = ProcessInfo.ProcessInfo.tratamentoVariaveisPDF(entradas_cda)
    #print(entradas_cda)

    entradas_merge = ProcessInfo.ProcessInfo.variaveisAdicionais(entradas_pje, entradas_cda)
    #print(entradas_merge, "Entradas Merge")
    entrada_npu = entradas_merge["NPU"][0]
    entrada_cda = entradas_merge["CDA"][0]

    #print(entradas_merge["POSSUI_TERMO_ESPOLIO"][0])

    resposta = Resposta(npu=entrada_npu, cda=entrada_cda)
    #print(resposta)
    #submete ao modelo
    serializer = None
    respostas = []
    try:
        json_retornos = recall_arvore_config(entradas_merge)
        #print(json_retornos, "Retorno")
        for retorno in json_retornos:
            #print(retorno)
            #npu = retorno["npu"]
            #cda = retorno["cda"]
            modelo = retorno["modelo"]
            resultado = retorno["resultado"]
            #print(modelo)
            #respostaModelo = RespostaModelo(nome_modelo=modelo, resultado=resultado, resposta=resposta)
            respostaModelo = RespostaModelo(nome_modelo=modelo, resultado=resultado)
            #print(respostaModelo)
            #resposta = Resposta(status='Successo', npu=npu, cda=cda, modelo=modelo, resultado=resultado)
            respostas.append(respostaModelo)
            #resposta.respostaModelo_set.add(respostaModelo)
            #resposta.resultados.set.add(respostaModelo)
        resposta.resultados = respostas
        resposta.status = "Sucesso"
        serializer = RespostaSerializer(resposta, many=False)
        #print(resposta.resultados)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as ex:
        resposta = Resposta(status='Erro', mensagem=ex)
        print(ex)
        serializer = RespostaSerializer(resposta)
        return Response(serializer.data, status=status.HTTP_502_BAD_GATEWAY)

    #return Response(entradas_merge, status=status.HTTP_200_OK)




class FileUploadView(APIView):

    parser_class = (MultiPartParser,)


    def put(self, request, format=None):
        if 'file' not in request.data:
            raise ParseError("Empty content")

        f = request.data['file']

        #mymodel.my_file_field.save(f.name, f, save=True)

        return Response({'received data': f})
