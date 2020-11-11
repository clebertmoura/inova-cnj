# app/servico/views.py

import ipdb
from flask import redirect, render_template, url_for, jsonify, request

from . import servico
from .. import db
from ..models import Fase, Movimento

@servico.route('/service/fases', methods=['GET'])
def get_fases():
    fases = Fase.query.order_by(Fase.id).all()
    res = []
    for fase in fases:
        res.append({
            'id': fase.id,
            'nome': fase.nome,
        'descricao': fase.descricao,
        })
    return jsonify(res)


@servico.route('/service/fases/<int:id>', methods=['GET'])
def get_fase(id):
    fase = Fase.query.filter_by(id=id).first()
    if not fase:
        abort(404)
    res = {
        'id': fase.id,
        'nome': fase.nome,
        'descricao': fase.descricao,
    }
    return jsonify(res)

@servico.route('/service/fases', methods=['POST'])
def create_fase():
    fase = Fase(nome=request.json['nome'],
                descricao=request.json['descricao'])

    db.session.add(fase)
    db.session.commit()

    res = {
        'id': fase.id,
        'nome': fase.nome,
        'descricao': fase.descricao,
    }
        
    return jsonify(res), 201

@servico.route('/service/fases/<int:id>', methods=['PUT'])
def update_fase(id):
    #ipdb.set_trace()
    fase = Fase.query.filter_by(id=id).first()
    if not fase:
        abort(404)

    fase.nome=request.json['nome']
    fase.descricao=request.json['descricao']

    db.session.commit()

    res = {
        'id': fase.id,
        'nome': fase.nome,
        'descricao': fase.descricao,
    }
        
    return jsonify(res), 201

@servico.route('/service/fases/<int:id>', methods=['DELETE'])
def delete_fase(id):
    fase = Fase.query.filter_by(id=id).first()
    if not fase:
        abort(404)
    db.session.delete(fase)
    db.session.commit()
    
    return jsonify('fase excluida'), 201