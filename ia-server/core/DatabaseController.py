import sqlite3


class DatabaseController:

    @staticmethod
    def consultar_processo(processo):
        resultado = [];
        dados = {}
        conn = sqlite3.connect('./data/processos.db')
        cursor = conn.cursor()
        cursor.execute("SELECT sigla_tribunal, orgao_julgador, natureza, grau, classe, natureza, assunto, dh_ajuizamento, porte_tribunal, mes_ajuizamento, codigo_localidade from processo where npu =?", (processo,))
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
            resultado.append(dados)

        conn.close()
        return resultado

    @staticmethod
    def consultar_processo_fase(processo):
        resultado = [];
        dados = {}
        conn = sqlite3.connect('./data/processos.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * from processo where npu =?", (processo,))
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
            resultado.append(dados)

        conn.close()
        return resultado

