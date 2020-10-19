import sqlite3


conn = sqlite3.connect("..\..\data\elis.db") # ou use :memory: para botá-lo na memória RAM

cursor = conn.cursor()

# cria uma tabela
cursor.execute("""CREATE TABLE modelo
                 (nome text, grupo text, alvo text, data_criacao text)
              """)

# cria modelos_campos
cursor.execute("""CREATE TABLE modelo_campo
                 (rowid_modelo integer, campo text)
              """)


cursor.execute("""CREATE TABLE log
                 (rowid_modelo integer, data_submissao text, origem text, resultado)
              """)

conn.commit()
