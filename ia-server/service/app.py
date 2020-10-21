import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")
from flask import Flask, request
from flask_restplus import Api, Resource, fields
from flask_cors import CORS
from core.ServiceController import ServiceController

flask_app = Flask(__name__)
CORS(flask_app)

app = Api(flask_app, version = '1.0', title= 'HACKATHON CNJ 1.0', description='HACKATHON CNJ 1.0 REST Service')


ns = app.namespace('', description='HACKATHON CNJ 1.0 REST')

historicoFase = app.model('historicoFase',{
    'nome': fields.String(required=True, description='Nome da fase'),
    'situacao': fields.String(required=True, description='Situacao da fase'),
    'dataConclusao': fields.String(required=True, description='Data de conclusão da fase'),
    'dataInicio': fields.String(required=True, description='Data de início da fase')
})

dadoFase = app.model('dadosFase',{
    'nome': fields.String(required=True, description='Nome da fase'),
    'duracao': fields.String(required=True, description='Duração da fase'),
    'duracaoPrevista': fields.String(required=True, description='Estimativa de duração'),
    'status': fields.String(required=True, description='Status da fase'),
})

alerta = app.model('alerta', {
    'nome': fields.String(required=True, description='Nome do alerta'),
    'valor': fields.String(required=True, description='Valor do alerta'),
})

resultadoProcesso = app.model('resultado', {
    'processo':fields.String(required=True, description='Número do processo'),
    'siglaTribunal':fields.String(required=True, description='Sigla do tribunal'),
    'orgaoJulgador':fields.String(required=True, description='Orgão julgador'),
    'natureza':fields.String(required=True, description='Natureza do processo'),
    'classe':fields.String(required=True, description='Classe processual'),
    'assunto':fields.String(required=True, description='Assunto processual'),
    'dataAjuizamento':fields.String(required=True, description='Data de ajuizamento'),
    'porteTribunal':fields.String(required=True, description='Porte do tribunal'),
    'historicoFases':fields.List(fields.Nested(historicoFase)),
    'dadosFases':fields.List(fields.Nested(dadoFase)),
    'alertas':fields.List(fields.Nested(alerta))
})

resposta = app.model('resposta', {
    'mensagem':fields.String(required=True, description='Mensagem de retorno'),
    'resultado':fields.Nested(resultadoProcesso)
})

dadosEntradaProcesso = app.model('entradaProcesso', {
    'processo':fields.String(required=True, description='Número do processo'),
    'siglaTribunal':fields.String(required=True, description='Sigla do tribunal'),
    'orgaoJulgador':fields.String(required=True, description='Orgão julgador'),
    'natureza':fields.String(required=True, description='Natureza do processo'),
    'classe':fields.String(required=True, description='Classe processual'),
    'assunto':fields.String(required=True, description='Assunto processual'),
    'codigo_orgaoJulgador':fields.Integer(required=True, description='Código do Orgão julgador'),
    'codigo_classe':fields.Integer(required=True, description='Classe processual'),
    'codigo_assunto':fields.Integer(required=True, description='Assunto processual'),
    'dataAjuizamento':fields.String(required=True, description='Data de ajuizamento'),
    'porteTribunal':fields.String(required=True, description='Porte do tribunal')
})

@ns.route('/service')
class IAHackathonRestService(Resource):
    def get(self):
        return "HACKATHON CNJ 1.0 REST Service"

@ns.route("/service/processos/<string:processo>")
@app.doc(responses={ 200: 'OK', 400: 'Argumentos invalidos', 404: 'Modelo nao encontrado',  502: 'Erro Interno' },
            params={'processo': 'Número(NPU) do processo'})
class IAHackathonRestService(Resource):
    @app.marshal_with(resposta)
    def get(self, processo):
        return ServiceController.consultar_processo(request, processo)


@ns.route("/service/processos/cadastrar")
@app.doc(responses={ 200: 'OK', 400: 'Argumentos invalidos',  502: 'Erro Interno' },
            params={ 'numero': 'Identificadores do item a ser processado',
                     'consolidar': 'Indica se o resultado deve ser consolidado em seu processamento',
                     'unidade': 'Unidade de submissao', 'entradas': 'Campos e valores da proposta' })
class IAHackathonRestService(Resource):
    def post(self):
        return ServiceController.cadastrarProcesso(request)

if __name__ == '__main__':
    flask_app.run(host='0.0.0.0', threaded=False)
