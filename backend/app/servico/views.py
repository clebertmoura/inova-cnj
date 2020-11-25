# app/servico/views.py

import ipdb
from flask import redirect, render_template, url_for, jsonify, request, send_file, abort

import numpy as np
import pandas as pd
import pandas.io.sql as sqlio

import psycopg2

import tempfile
import jsonpickle

import pm4py
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.algo.discovery.dfg import algorithm as dfg_discovery
from pm4py.visualization.dfg import visualizer as dfg_visualization
from pm4py.objects.conversion.dfg import converter as dfg_mining
from pm4py.visualization.petrinet import visualizer as pn_visualizer
from pm4py.algo.filtering.log.variants import variants_filter

from . import servico
from .. import db
from ..models import *

from ..proccessmining.geradorpm import *

import os 

db_host = os.getenv('POSTGRES_HOST')
db_port = os.getenv('POSTGRES_PORT')
db_name = os.getenv('POSTGRES_DB')
db_user = os.getenv('POSTGRES_USER')
db_pass = os.getenv('POSTGRES_PASSWORD')

@servico.route('/')
def home():
    return "Serviço Funcionando"

def montarFaseJson(fase):
    movs = []
    for movimento in fase.movimentos:
        movs.append(montarMovimentoJson(movimento))
        
    faseJson = {
        'cod': fase.cod,
        'descricao': fase.descricao,
        'cod_tribunal': fase.cod_tribunal,
        'tribunal': montarTribunalJson(fase.tribunal),
        'movimentos': movs,
    }
    return faseJson

def montarTribunalJson(tribunal):
    tribunalJson = {
        'cod' : tribunal.cod,
        'descricao' : tribunal.descricao,
        'sigla' : tribunal.sigla,
        'tipo' : tribunal.tipo,
        'porte' : tribunal.porte,
        'latitude' : str(tribunal.latitude),
        'longitude' : str(tribunal.longitude),
        'coduf' : str(tribunal.coduf),
        'uf' : tribunal.uf,
        'tipotribunal_oj' : tribunal.tipotribunal_oj,
    }
    return tribunalJson

def montarMovimentoJson(movimento):
    movimentoJson = {
        'cod': movimento.cod,
        'descricao': movimento.descricao,
        'ativo': movimento.ativo,
        'cod_completo': movimento.cod_completo,
        'descricao_completa': movimento.descricao_completa,    
    }
    return movimentoJson

@servico.route('/api/v1/fase', methods=['GET'])
def get_fases():
    fases = Fase.query.order_by(Fase.cod).all()
    res = []
    for fase in fases:
        res.append(montarFaseJson(fase))
    return jsonify(res)

@servico.route('/api/v1/fase/<int:cod>', methods=['GET'])
def get_fase(cod):
    fase = Fase.query.filter_by(cod=cod).first()
    if not fase:
        abort(404)
    
    return jsonify(montarFaseJson(fase))

@servico.route('/api/v1/fase', methods=['POST'])
def create_fase():
    fase = Fase(descricao=request.json['descricao'], 
                cod_tribunal=request.json['cod_tribunal'])
    
    for json in request.json['movimentos']:
        mov = Movimento.query.filter_by(cod=json['codigo']).first()
        fase.movimentos.append(mov)
        fase.movimentos.fase=fase.descricao

    db.session.add(fase)
    db.session.commit()

    return jsonify(montarFaseJson(fase)), 201

@servico.route('/api/v1/fase/<int:cod>', methods=['PUT'])
def update_fase(cod):
    fase = Fase.query.filter_by(cod=cod).first()
    if not fase:
        abort(404)

    fase.descricao=request.json['descricao']
    fase.cod_tribunal=request.json['cod_tribunal']

    fase.movimentos = []
    for json in request.json['movimentos']:
        mov = Movimento.query.filter_by(cod=json['codigo']).first()
        fase.movimentos.append(mov)
        fase.movimentos.fase=fase.descricao

    db.session.commit()
        
    return jsonify(montarFaseJson(fase)), 201

@servico.route('/api/v1/fase/<int:cod>', methods=['DELETE'])
def delete_fase(cod):
    fase = Fase.query.filter_by(cod=cod).first()
    if not fase:
        abort(404)
    db.session.delete(fase)
    db.session.commit()
    
    return jsonify('fase excluida'), 201

@servico.route('/api/v1/tipo-justica', methods=['GET'])
def api_lista_tipojustica():
    tipos = Tribunal.query.with_entities(Tribunal.tipo).order_by(Tribunal.tipo).group_by(Tribunal.tipo)
    res = []
    for t in tipos:
        res.append({
            "cod" : t.tipo,
            "descricao" : t.tipo
        })

    return jsonify(res)
    
@servico.route('/api/v1/porte', methods=['GET'])
def api_lista_porte():
    portes = Tribunal.query.with_entities(Tribunal.porte).order_by(Tribunal.porte).group_by(Tribunal.porte)
    res = []
    for p in portes:
        res.append({
            "cod" : p.porte,
            "descricao" : p.porte
        })

    return jsonify(res)
    
@servico.route('/api/v1/tribunal', methods=['GET'])
def api_lista_tribunal():
    porte = request.args.get('porte')
    tipo = request.args.get('tipo')
    tribunais = None
    if (porte != None and tipo != None):
        tribunais = Tribunal.query.filter_by(and_(porte = porte, tipo = tipo)).order_by(Tribunal.cod).all()
    elif porte != None :
        tribunais = Tribunal.query.filter_by(porte = porte).order_by(Tribunal.cod).all()
    elif tipo != None :
        tribunais = Tribunal.query.filter_by(tipo = tipo).order_by(Tribunal.cod).all()
    else:
        tribunais = Tribunal.query.order_by(Tribunal.cod).all()
    
    res = []
    for tribunal in tribunais:
        res.append(montarTribunalJson(tribunal))
    return jsonify(res)

@servico.route('/api/v1/orgao-julgador', methods=['GET'])
def get_orgaosJulgadores():
    codtribunal = request.args.get('codtribunal')
    conn = psycopg2.connect(host=db_host, port=db_port, database=db_name, user=db_user, password=db_pass)
    cur = conn.cursor()

    qry = "SELECT cod, tipo_oj, descricao, codtribunal, ordem "
    qry+= "FROM inovacnj.orgao_julgador "
    qry+= "WHERE (1=1) "
    
    if codtribunal != None :
        qry+= "AND codtribunal = '" + codtribunal + "' "
    qry+= "ORDER BY ordem NULLS LAST "

    cur.execute(qry)
    lista = cur.fetchall()
    return jsonify(lista)
    
@servico.route('/api/v1/orgao-julgador-por-tribunal-e-atuacao', methods=['GET'])
def get_orgaosJulgadores_por_tribunal_e_atuacao():
    codtribunal = request.args.get('codtribunal')
    atuacao = request.args.get('atuacao')
    conn = psycopg2.connect(host=db_host, port=db_port, database=db_name, user=db_user, password=db_pass)
    cur = conn.cursor()

    qry = "SELECT "
    qry+= "  cod, "
    qry+= "  descricao "
    qry+= "FROM inovacnj.orgao_julgador oj "
    qry+= "WHERE (1=1) "

    if codtribunal is not None :
        qry+= "AND oj.codtribunal = '" + codtribunal + "' "
    if atuacao is not None :
        qry+= "AND oj.atuacao_vara = '" + atuacao + "' "

    qry+= "ORDER BY ordem NULLS LAST"

    cur.execute(qry)
    lista = cur.fetchall()
    return jsonify(lista)
    
@servico.route('/api/v1/atuacao-orgaojulgador', methods=['GET'])
def get_atuacaoOrgaosJulgador():
    ramojustica = request.args.get('ramojustica')
    codtribunal = request.args.get('codtribunal')
    conn = psycopg2.connect(host=db_host, port=db_port, database=db_name, user=db_user, password=db_pass)
    cur = conn.cursor()

    qry = "SELECT DISTINCT "
    qry+= " atuacao_vara AS cod, "
    qry+= " atuacao_vara AS descricao, "
    qry+= " tr.tipo AS tipo "
    qry+= "FROM inovacnj.orgao_julgador oj "
    qry+= "INNER JOIN inovacnj.tribunal tr ON tr.cod = oj.codtribunal "
    qry+= "WHERE atuacao_vara IS NOT NULL "
    
    if ramojustica != None :
        qry+= "AND tr.tipo = '" + ramojustica + "' "
    if codtribunal != None :
        qry+= "AND codtribunal = '" + codtribunal + "' "
    qry+= "ORDER BY atuacao_vara "

    cur.execute(qry)
    lista = cur.fetchall()
    return jsonify(lista)

@servico.route('/api/v1/natureza', methods=['GET'])
def api_lista_natureza():
    naturezas = Natureza.query.order_by(Natureza.cod).all()
    res = []
    for nat in naturezas:
        res.append({
            'cod' : nat.cod,
            'descricao' : nat.descricao,
        })
    return jsonify(res)

@servico.route('/api/v1/classe', methods=['GET'])
def api_lista_classe():
    natureza = request.args.get('natureza')
    classes = None
    if natureza != None :
        classes = Classe.query.filter(Classe.naturezaClasses.any(cod=natureza)).order_by(Classe.cod).all()
    else:
        classes = Classe.query.order_by(Classe.cod).all()
    res = []
    for classe in classes:
        res.append({
            'cod' : classe.cod,
            'descricao' : classe.descricao,
            'sigla' : classe.sigla,
            'codpai' : str(classe.codpai),
        })
    return jsonify(res)

@servico.route('/api/v1/movimento', methods=['GET'])
def api_lista_movimento():
    movimentos = Movimento.query.order_by(Movimento.cod).all()
    movs = []
    for movimento in movimentos:
        if movimento.cod > 0:
            movs.append(montarMovimentoJson(movimento))
    
    return jsonify(movs)

@servico.route('/api/v1/assuntos-ranking', methods=['GET'])
def api_lista_assuntos_ranking():
    tipo = request.args.get('tipo')
    codtribunal = request.args.get('codtribunal')
    codorgaoj = request.args.get('codorgaoj')
    natureza = request.args.get('natureza')
    codclasse = request.args.get('codclasse')
    
    conn = psycopg2.connect(host=db_host, port=db_port, database=db_name, user=db_user, password=db_pass)
    cur = conn.cursor()
      
    qry = "SELECT descassunto as assunto, count(distinct npu) as quantidade "
    qry+= "FROM inovacnj.fat_movimentos_te, inovacnj.tribunal "
    qry+= "WHERE (1=1) "
    qry+= "AND fat_movimentos_te.codtribunal = tribunal.cod "
    if tipo != None :
        qry+= "AND tribunal.tipo = '" + tipo + "' "
    if codtribunal != None :
        qry+= "AND tribunal.cod = '" + codtribunal + "' "
    if codorgaoj != None :
        qry+= "AND fat_movimentos_te.oj_cod = '" + codorgaoj + "' "
    if natureza != None :
        qry+= "AND fat_movimentos_te.natureza = '" + natureza + "' "
    if codclasse != None :
        qry+= "AND fat_movimentos_te.codclasse = '" + codclasse + "' "
        
    qry+= "GROUP BY descassunto "
    qry+= "ORDER BY quantidade desc "
    
    cur.execute(qry)
    lista = cur.fetchall()

    return jsonify(lista)


@servico.route('/api/v1/gerar-modelo-pm')
def api_gerar_modelo_pm():
    ramojustica = request.args.get('ramojustica')
    codtribunal = request.args.get('codtribunal')
    atuacao = request.args.get('atuacao')
    grau = request.args.get('grau')
    codorgaoj = request.args.get('codorgaoj')
    natureza = request.args.get('natureza')
    codclasse = request.args.get('codclasse')
    dtinicio = request.args.get('dtinicio')
    dtfim = request.args.get('dtfim')
    baixado = request.args.get('baixado')
    sensibilidade = request.args.get('sensibilidade')
    metrica = request.args.get('metrica')
    formato = request.args.get('formato')
    
    if ramojustica is None:
        abort(400, description="ramojustica nao informado")
    if codtribunal is None:
        abort(400, description="codtribunal nao informado")
    
    gviz = gerar_view_dfg_model_from_params(ramojustica, codtribunal, atuacao, grau, codorgaoj, natureza, codclasse, \
               dtinicio, dtfim, baixado=baixado, sensibility=sensibilidade, metric_type=metrica, image_format=formato)
    if gviz != None:
        file_remover = FileRemover()
        tempdir = tempfile.mkdtemp()
        path = tempdir + "/model_mp." + str(formato).lower()
        dfg_visualization.save(gviz, path)
        resp = send_file(path, as_attachment=False)
        file_remover.cleanup_once_done(resp, path)
        return resp
    else:
        print("sem dados")
        abort(404, description="Nao encontrado")


@servico.route('/api/v1/gerar-estatisticas-modelo-pm')
def api_gerar_estatisticas_modelo_pm():
    ramojustica = request.args.get('ramojustica')
    codtribunal = request.args.get('codtribunal')
    atuacao = request.args.get('atuacao')
    grau = request.args.get('grau')
    codorgaoj = request.args.get('codorgaoj')
    natureza = request.args.get('natureza')
    codclasse = request.args.get('codclasse')
    dtinicio = request.args.get('dtinicio')
    dtfim = request.args.get('dtfim')
    baixado = request.args.get('baixado')
    sensibilidade = request.args.get('sensibilidade')
    
    if ramojustica is None:
        abort(400, description="ramojustica nao informado")
    if codtribunal is None:
        abort(400, description="codtribunal nao informado")
    
    estat = gerar_estatistica_model_from_params(ramojustica, codtribunal, atuacao, grau, codorgaoj, natureza, codclasse, \
               dtinicio, dtfim, baixado=baixado, sensibility=sensibilidade)
    if estat is not None:
        return jsonpickle.encode(estat)
    else:
        print("sem dados")
        abort(404, description="Nao encontrado")

@servico.route('/api/v1/gerar-orgaosjulgadores-modelfit')
def api_gerar_orgaosjulgadores_modelfit():
    ramojustica = request.args.get('ramojustica')
    codtribunal = request.args.get('codtribunal')
    atuacao = request.args.get('atuacao')
    grau = request.args.get('grau')
    codorgaoj = request.args.get('codorgaoj')
    natureza = request.args.get('natureza')
    codclasse = request.args.get('codclasse')
    dtinicio = request.args.get('dtinicio')
    dtfim = request.args.get('dtfim')
    baixado = request.args.get('baixado')
    sensibilidade = request.args.get('sensibilidade')
    
    if ramojustica is None:
        abort(400, description="ramojustica nao informado")
    if codtribunal is None:
        abort(400, description="codtribunal nao informado")
    if atuacao is None:
        abort(400, description="atuacao nao informado")
    
    modelfit = gerar_orgaosjulgadores_modelfit_from_params(ramojustica, codtribunal, atuacao, grau, codorgaoj, natureza, codclasse, \
               dtinicio, dtfim, baixado=baixado, sensibility=sensibilidade)
    if modelfit is not None:
        return jsonpickle.encode(modelfit)
    else:
        print("sem dados")
        abort(404, description="Nao encontrado")
    