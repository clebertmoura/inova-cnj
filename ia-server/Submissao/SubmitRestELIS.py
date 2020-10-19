import requests
from pathlib import Path

url = 'http://127.0.0.1:8000/servicoELIS/submeterExecutivosFiscaisRecife/'
data = '''{
    "dadosPje": {
        "NPU" : "0088686-04.2018.8.17.2001",
        "Órgão Julgador" : "Vara dos Executivos Fiscais Municipais da Capital",
        "Assunto" : "IPTU/ Imposto Predial e Territorial Urbano",
        "Classe Judicial" : "EXECUÇÃO FISCAL",
        "Data da Distribuição" : "2018-11-21 14:29:00.955",
        "Valor da Causa" : 3143.71,
        "Executado" : "CAIXA ECONOMICA FEDERAL",
        "CPF/CNPJ do Executado" : "454.923.604-34",
        "CDA" : "1.17.025183-7",
        "Tarefa" : "Conferência inicial"
    },
    "dadosCDA": {
    "PETICAO_INICIAL_ENDERECO": "RUA GONCALVES DIAS, 56, CAMPO GRANDE, RECIFE, PE, 52031-040",
    "PETICAO_INICIAL_DEVEDOR": "CAIXA ECONOMICA FEDERAL",
    "PETICAO_INICIAL_INSCRICAO": "236.906-0",
    "PETICAO_INICIAL_VALOR": 3143.71,
    "PETICAO_INICIAL_CDA_NUMERO": "1.17.025183-7",
    "PETICAO_INICIAL_CDA_TIPO": "IPTU/Taxas imobiliárias",
    "CDA_CDA_NUMERO": "1.17.025183-7",
    "CDA_DATA_INSCRICAO": "21/10/2017",
    "CDA_SERIE_IMOBILIARIA": 1,
    "CDA_SERIE_MERCANTIL": 0,
    "CDA_SERIE_ESTIMATIVA": 0,
    "CDA_DEVEDOR": "CAIXA ECONOMICA FEDERAL",
    "CDA_CPF_CNPJ": "454.923.604-34",
    "CDA_INSCRICAO": "236.906-0",
    "CDA_ENDERECO": "ORIGEM DA DÍVIDA",
    "QTD_IPTU": 1,
    "QTD_TLP": 1,
    "QTD_OUTROS": 0,
    "CDA_ANO_MENOR_EXERCICIO_IPTU": 2015,
    "CDA_ANO_MAIOR_EXERCICIO_IPTU": 2015,
    "CDA_ANO_MENOR_EXERCICIO_TLP": 2015,
    "CDA_ANO_MAIOR_EXERCICIO_TLP": 2015,
    "CDA_ANO_MENOR_EXERCICIO_OUTROS": 9999,
    "CDA_ANO_MAIOR_EXERCICIO_OUTROS": 0,
    "CDA_SEM_PONTUACAO": "CDA1170251837"
    }
}'''


session =requests.Session()
session.trust_env = False

url_pdf = 'http://127.0.0.1:8000/servicoELIS/submeterCDAExecutivosFiscaisRecife/'
path = Path("./data")
filename = path / '1.14.029075-3.pdf'
#file_content = open(filename, 'rb')
files = {'file': open(filename, 'rb')}
#Envia o arquivo
response = session.post(url_pdf, files=files)

print(response)
print(response.text)


response2 = session.post(url, json=data)



#response = requests.post(url, json=data)


print(response2)
print(response2.text)