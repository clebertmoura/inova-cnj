import sqlite3
import datetime


class DatabaseController:

    @staticmethod
    def consultar_processo(processo):
        resultado = [];
        dados = {}
        conn = sqlite3.connect('./data/processos.db')
        cursor = conn.cursor()
        cursor.execute("SELECT sigla_tribunal, orgao_julgador, natureza, grau, classe, natureza, assunto, "
                       "dh_ajuizamento, porte_tribunal, mes_ajuizamento, codigo_localidade, cod_orgao_julgador, "
                       "cod_assunto, cod_classe, tipo_justica from processo where npu =?", (processo,))
        for dado in cursor:
            dados['sigla_tribunal'] = dado[0]
            dados['orgao_julgador'] = dado[1]
            dados['natureza'] = dado[2]
            dados['grau'] = dado[3]
            dados['classe'] = dado[4]
            dados['natureza'] = dado[5]
            dados['assunto'] = dado[6]
            dados['dh_ajuizamento'] = dado[7]
            dados['porte_tribunal'] = dado[8]
            dados['mes_ajuizamento'] = dado[9]
            dados['codigo_localidade'] = dado[10]
            dados['cod_orgao_julgador'] = dado[11]
            dados['cod_assunto'] = dado[12]
            dados['cod_classe'] = dado[13]
            dados['tipo_justica'] = dado[14]
            resultado.append(dados)

        conn.close()
        return resultado

    @staticmethod
    def consultar_processo_fase(processo):
        resultado = [];
        dados = {}
        conn = sqlite3.connect('./data/processos.db')
        cursor = conn.cursor()
        cursor.execute("SELECT id_fase, nome_fase, duracao, status_fase, dt_inicio, dt_fim from processo_fase where npu =?", (processo,))
        for dado in cursor:
            dados['id_fase'] = dado[0]
            dados['nome_fase'] = dado[1]
            dados['duracao'] = dado[2]
            dados['status_fase'] = dado[3]
            dados['dt_inicio'] = dado[4]
            dados['dt_fim'] = dado[5]
            resultado.append(dados.copy())
        conn.close()
        return resultado

    @staticmethod
    def cadastrar_processo(processo):
        #Dados
        num_processo = processo['processo']
        grau = processo['grau']
        siglaTribunal = processo['siglaTribunal']
        orgaoJulgador = processo['orgaoJulgador']
        natureza = processo['natureza']
        classe = processo['classe']
        assunto = processo['assunto']
        codigo_orgaoJulgador = processo['codigo_orgaoJulgador']
        codigo_localidade = processo['codigo_localidade']
        codigo_classe = processo['codigo_classe']
        codigo_assunto = processo['codigo_assunto']
        dataAjuizamento = processo['dataAjuizamento']
        porteTribunal = processo['porteTribunal']
        tipoJustica = processo['tipoJustica']
        # pega o mes do ajuizamento
        mes_ajuizamento = 1
        if dataAjuizamento != '':
            data = datetime.datetime.strptime(dataAjuizamento, "%Y-%m-%d")
            mes_ajuizamento = data.month
        #Conecta na base
        conn = sqlite3.connect('./data/processos.db')
        cursor = conn.cursor()
        sql = "INSERT INTO processo " + \
            " (npu, sigla_tribunal, orgao_julgador, natureza, classe, assunto, cod_orgao_julgador, cod_classe, " \
            "cod_assunto, dh_ajuizamento, mes_ajuizamento, grau, porte_tribunal, " + \
            " codigo_localidade,  tipo_justica) " + \
            " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        cursor.execute(sql, (num_processo, siglaTribunal, orgaoJulgador, natureza, classe, assunto, codigo_orgaoJulgador,
                             codigo_classe, codigo_assunto, dataAjuizamento, mes_ajuizamento, grau, porteTribunal,
                             codigo_localidade, tipoJustica))
        conn.commit()
        cursor.close()

    @staticmethod
    def cadastrar_fase(processo):
        # Dados
        num_processo = processo['processo']
        id_fase = processo['id_fase']
        status_fase = processo['status_fase']
        nome_fase = processo['nome_fase']
        duracao = processo['duracao']
        dt_inicio = processo['dt_inicio']
        dt_fim = processo['dt_fim']
        # Conecta na base
        conn = sqlite3.connect('./data/processos.db')
        cursor = conn.cursor()
        sql = 'INSERT INTO processo_fase ' + \
              ' (npu, id_fase, status_fase, nome_fase, duracao, dt_inicio, dt_fim) ' + \
              ' VALUES(?, ?, ?, ?, ?, ?, ?)'
        cursor.execute(sql, (num_processo, id_fase, status_fase, nome_fase, duracao, dt_inicio, dt_fim))
        conn.commit()
        cursor.close()

    @staticmethod
    def consultar_total_processos_cadastrados():
        resultado = -1
        conn = sqlite3.connect('./data/processos.db')
        cursor = conn.cursor()
        cursor.execute("SELECT count(distinct npu) as total from processo")
        for dado in cursor:
            resultado = dado[0]
        conn.close()
        return resultado

    @staticmethod
    def consultar_total_tipos_justica():
        resultado = -1
        conn = sqlite3.connect('./data/processos.db')
        cursor = conn.cursor()
        cursor.execute("SELECT count(distinct tipo_justica) as tipos_justica from processo")
        for dado in cursor:
            resultado = dado[0]
        conn.close()
        return resultado

    @staticmethod
    def consultar_total_orgaos_julgadores():
        resultado = -1
        conn = sqlite3.connect('./data/processos.db')
        cursor = conn.cursor()
        cursor.execute("SELECT count(distinct cod_orgao_julgador) as tipos_justica from processo")
        for dado in cursor:
            resultado = dado[0]
        conn.close()
        return resultado
