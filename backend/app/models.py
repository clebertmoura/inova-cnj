# app/models.py

from app import db

class Assunto(db.Model):
    __tablename__ = 'assunto'

    cod = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(200))
    codpai = db.Column(db.Float)
    
    def __repr__(self):
        return '<Assunto: {}>'.format(self.descricao)

class AssociacaoFaseMovimento(db.Model):
    __tablename__ = 'fase_movimento'

    cod_fase = db.Column(db.Integer, db.ForeignKey('fase.cod'), primary_key=True)
    cod_movimento = db.Column(db.Integer, db.ForeignKey('movimentoscnj.cod'), primary_key=True)
    fase = db.Column(db.String(200))

class Fase(db.Model):
    __tablename__ = 'fase'

    cod = db.Column(db.Integer, db.Sequence('seq_fase'), primary_key=True)
    descricao = db.Column(db.String(200))
    cod_tribunal = db.Column(db.String(200), db.ForeignKey('tribunal.cod'))
    tribunal = db.relationship('Tribunal', backref=db.backref('tribunal', lazy='dynamic'))
    movimentos = db.relationship('Movimento', secondary='fase_movimento',
        backref=db.backref('faseMovimentos', lazy='dynamic'))
    
    def __repr__(self):
        return '<Fase: {}>'.format(self.descricao)

class Movimento(db.Model):
    __tablename__ = 'movimentoscnj'

    cod = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(200))
    ativo = db.Column(db.String(200))
    cod_completo = db.Column(db.String(200))
    descricao_completa = db.Column(db.String(200))
    fase = db.Column(db.String(200))
    
    def __repr__(self):
        return '<Movimento: {}>'.format(self.descricao)

class AssociacaoNaturezaClasse(db.Model):
    __tablename__ = 'natureza_classe'

    cod_natureza = db.Column(db.Integer, db.ForeignKey('natureza.cod'), primary_key=True)
    cod_classe = db.Column(db.Integer, db.ForeignKey('classe.cod'), primary_key=True)

class Natureza(db.Model):
    __tablename__ = 'natureza'

    cod = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(200))
    classes = db.relationship('Classe', secondary='natureza_classe',
        backref=db.backref('naturezaClasses', lazy='dynamic'))
    
    def __repr__(self):
        return '<Natureza: {}>'.format(self.descricao)

class Classe(db.Model):
    __tablename__ = 'classe'

    cod = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(200))
    sigla = db.Column(db.String(200))
    codpai = db.Column(db.Float)
    
    def __repr__(self):
        return '<Classe: {}>'.format(self.descricao)

class Tribunal(db.Model):
    __tablename__ = 'tribunal'

    cod = db.Column(db.String(200), primary_key=True)
    descricao = db.Column(db.String(200))
    sigla = db.Column(db.String(200))
    tipo = db.Column(db.String(200))
    porte = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    coduf = db.Column(db.Integer)
    uf = db.Column(db.String(200))
    tipotribunal_oj = db.Column(db.String(200))
     
    def __repr__(self):
        return '<Tribunal: {}>'.format(self.descricao)

class OrgaoJulgador(db.Model):
    __tablename__ = 'orgao_julgador'

    cod = db.Column(db.String(200), primary_key=True)
    descricao = db.Column(db.String(200))
    codpai = db.Column(db.Float)
    sigla_tipoj = db.Column(db.String(200))
    tipo_oj = db.Column(db.String(200))
    cidade = db.Column(db.String(200))
    uf = db.Column(db.String(200))
    codibge = db.Column(db.Float)
    esfera = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    
    def __repr__(self):
        return '<OrgaoJulgador: {}>'.format(self.descricao)
    