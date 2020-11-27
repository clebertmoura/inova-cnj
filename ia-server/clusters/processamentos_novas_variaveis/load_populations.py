import pandas as pd


estados = ['Acre', 'Alagoas', 'Amapa', 'Amazonas', 'Bahia', 'Ceara', 'DistritoFederal', 'EspiritoSanto', 'Goias',
           'Maranhao', 'MatoGrosso', 'MatoGrossodoSul', 'MinasGerais', 'Para', 'Paraiba', 'Parana', 'Pernambuco',
           'Piaui', 'RiodeJaneiro', 'RioGrandedoNorte', 'RioGrandedoSul', 'Rondonia', 'Roraima', 'SantaCatarina',
           'SaoPaulo', 'Sergipe', 'Tocantins']
arquivos_estados = ['1_2', '1_14', '1_6', '1_3', '1_16', '1_10', '1_27', '1_18', '1_26',
                    '1_8', '1_25', '1_24', '1_17', '1_5', '1_12', '1_21', '1_13',
                    '1_9', '1_19', '1_11', '1_23', '1_1', '1_4', '1_22',
                    '1_20', '1_15', '1_7']
extensao = '.xls'
pasta_base = './dados_ibge'
prefixo_arquivo = 'tab2_'
prefixo_pasta = 'sinopse_uf_'
titulos = ['Nome', 'Populacao_Total','Populacao_Urbana','Populacao_Sede_Municipal','Populacao_Relativa_Total',
           'Populacao_Relativa_Urbana','Populacao_Relativa_Sede_Municipal','Area_total','Densidade','CodLocalidade']
tipos = {'CodLocalidade': 'str' }
linhas_pulo = 9
texto_IBGE = 'Fonte: IBGE, Censo Demográfico 2010.'

dados = pd.DataFrame()
for i in range(0, len(estados)):
    print('Estado:' + estados[i])
    arquivo_str = pasta_base + '/' + prefixo_pasta + estados[i] + '/' + prefixo_arquivo + arquivos_estados[i] + \
        estados[i] + extensao
    print('Arquivo: ' + arquivo_str)
    arquivo = pd.read_excel(arquivo_str, skiprows=linhas_pulo, index_col=None, header=None, names=titulos, dtype=tipos)
    arquivo = arquivo[arquivo.Nome != texto_IBGE]
    arquivo = arquivo[arquivo.Nome != 'Total']
    arquivo.CodLocalidade = arquivo.CodLocalidade.astype(str).replace('.0','')
    arquivo['Estado'] = estados[i]
    arquivo['Estratificacao'] = arquivo['Populacao_Total'].apply(
        lambda x: 'Pequeno_Porte' if x < 25000.0 else 'Medio_Porte' if x < 100000.0 else 'Grande_Porte')
    print('Linhas arquivo:' + str(arquivo.size))
    dados = dados.append(arquivo)

print('Total importado: ' + str(dados.size))
print(dados.head(10))
#dados = dados.astype(str)
print(dados.dtypes)

#dados['CodLocalidade'] = dados['CodLocalidade'].apply(str)

#cod_localidade_preenchido = dados.CodLocalidade != ''
#dados = dados[cod_localidade_preenchido]
#print(cod_localidade_preenchido)
#print(dados.dtypes)
arquivo_saida = pasta_base + '/municipios.csv'
dados.reset_index()
dados.to_csv(arquivo_saida, sep = ';', index=None)


