# app/models.py

from app import db

class Movimento(db.Model):
    """
    Create a Movimento table
    """

    __tablename__ = 'movimentos'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(60), unique=True)
    descricao = db.Column(db.String(200))
    fase_id = db.Column(db.Integer, db.ForeignKey('fases.id'))
    
    def __repr__(self):
        return '<Movimento: {}>'.format(self.nome)

class Fase(db.Model):
    """
    Create a Fase table
    """

    __tablename__ = 'fases'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(60), unique=True)
    descricao = db.Column(db.String(200))
    movimentos = db.relationship('Movimento', backref='fase',
                                lazy='dynamic')
    
    def __repr__(self):
        return '<Fase: {}>'.format(self.nome)


    