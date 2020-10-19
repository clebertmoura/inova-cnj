import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")
from flask import Flask, request
from flask_restplus import Api, Resource, fields
from core.ServiceController import ServiceController

flask_app = Flask(__name__)

app = Api(flask_app, version = '1.0', title= 'HACKATHON CNJ 1.0', description='HACKATHON CNJ 1.0 REST Service')

ns = app.namespace('', description='HACKATHON CNJ 1.0 REST')

historicoFase = app.model('historicoFase',{
    'nome': fields.String(required=True, description='Nome da fase'),
    'situacao': fields.String(required=True, description='Situacao da fase'),
    'dataConclusao': fields.String(required=True, description='Data de conclusão da fase'),
    'dataInicio': fields.String(required=True, description='Data de início da fase')
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
    'historicoFases':fields.List(fields.Nested(historicoFase))
})

resposta = app.model('resposta', {
    'mensagem':fields.String(required=True, description='Mensagem de retorno'),
    'resultado':fields.Nested(resultadoProcesso)
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
