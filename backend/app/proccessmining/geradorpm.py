# import das bibliotecas
import psycopg2
import os

import numpy as np
import pandas as pd
import pandas.io.sql as sqlio

import random
import string

import shutil
import tempfile
import weakref

import timer3
import concurrent.futures
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import as_completed

import pm4py
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.conversion.dfg import converter as dfg_mining
from pm4py.algo.discovery.dfg import algorithm as dfg_discovery
from pm4py.algo.discovery.alpha import algorithm as alpha_miner
from pm4py.algo.filtering.log.variants import variants_filter
from pm4py.algo.conformance.tokenreplay import algorithm as token_replay
from pm4py.visualization.dfg import visualizer as dfg_visualization
from pm4py.visualization.petrinet import visualizer as pn_visualizer
from pm4py.statistics.traces.log import case_statistics
from pm4py.statistics.traces.log import case_arrival
from pm4py.statistics.start_activities.log import get as start_activities
from pm4py.statistics.end_activities.log import get as end_activities
from pm4py.objects.stochastic_petri import ctmc

db_host = os.getenv('POSTGRES_HOST')
db_port = os.getenv('POSTGRES_PORT')
db_name = os.getenv('POSTGRES_DB')
db_user = os.getenv('POSTGRES_USER')
db_pass = os.getenv('POSTGRES_PASSWORD')

# Mapa chave=valor - ramo de justica/sufixo_tabela_fato
ramos_justica = {'Eleitoral': 'jele', 'Estadual': 'jest', 'Federal': 'jfed', 'Militar': 'jmil', 'Trabalho': 'jtra'}

# Cache para logs de evento
eventLogCache = {}

# Remove um log de eventos da cache pela chave
def clear_eventlog_cache(cacheKey):
    eventLog = eventLogCache.get(cacheKey)

    if eventLog is not None :
        eventLogCache[cacheKey] = None

# gera um log de eventos de acordo com os parametros informados.
def gerar_log_eventos(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, dtinicio, dtfim, 
                      baixado = None, sensibility = '60'):
    
    eventLog = None

    cacheKey = "{0}-{1}-{2}-{3}-{4}-{5}-{6}-{7}-{8}-{9}".format(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, dtinicio, dtfim, baixado)
    
    cachedEventLog = eventLogCache.get(cacheKey)
    if cachedEventLog is not None :
        eventLog = cachedEventLog

    else :
        conn = psycopg2.connect(host=db_host, port=db_port, database=db_name, user=db_user, password=db_pass)
        
        sufixo_ramo = ramos_justica.get(ramo_justica, 'default')
        
        tabela_fato = "inovacnj.fat_movimento_" + sufixo_ramo
        
        qry = "SELECT "
        qry+= "  fat.npu as npu, "
        qry+= "  CASE "
        qry+= "  WHEN f.descricao IS NULL THEN fat.mov_cod ||  ' - ' || mov.descricao "
        qry+= "  ELSE f.descricao || ': ' || fat.mov_cod ||  ' - ' || mov.descricao "
        qry+= "  END AS atividade, "
        qry+= "  fat.mov_dtmov as mov_dtmov "
        qry+= "FROM " + tabela_fato + " fat "
        qry+= "INNER JOIN inovacnj.acervo_processo_" + sufixo_ramo + " ap ON ap.npu = fat.npu "
        qry+= "INNER JOIN inovacnj.orgao_julgador oj ON oj.cod::varchar = fat.oj_cod "
        qry+= "INNER JOIN inovacnj.movimentocnj mov ON mov.cod = fat.mov_cod "
        qry+= "INNER JOIN inovacnj.natureza_classe nc ON nc.cod_classe = fat.codclasse "
        qry+= "INNER JOIN inovacnj.natureza nat ON nat.cod = nc.cod_natureza "
        qry+= "LEFT JOIN inovacnj.fase_movimento fm ON fm.cod_movimento = fat.mov_cod "
        qry+= "LEFT JOIN inovacnj.fase f ON f.cod = fm.cod_fase "
        qry+= "WHERE (1=1) "
        
        if baixado is not None :
            qry+= "AND ap.baixado = '" + baixado + "' "
        if codtribunal is not None :
            qry+= "AND fat.codtribunal = '" + codtribunal + "' "
        if atuacao is not None :
            qry+= "AND oj.atuacao_vara = '" + atuacao + "' "
        if codorgaoj is not None :
            qry+= "AND fat.oj_cod = '" + codorgaoj + "' "
        if grau is not None :
            qry+= "AND fat.grau = '" + grau + "' "
        if codnatureza is not None :
            qry+= "AND nat.cod = " + str(codnatureza) + " "
        if codclasse is not None :
            qry+= "AND fat.codclasse = " + str(codclasse) + " "
            
        if dtinicio is not None and dtfim is not None:
            qry+= "AND fat.mov_dtmov BETWEEN to_timestamp('" + dtinicio + "', 'yyyy-MM-dd') AND to_timestamp('" + dtfim + "', 'yyyy-MM-dd') "
            
        qry+= "ORDER BY fat.npu, fat.mov_dtmov ASC "
        
        df_logeventos_pd = pd.read_sql_query(qry, conn)
        
        if df_logeventos_pd.empty == False :
            df_event_log = pm4py.format_dataframe(df_logeventos_pd, case_id='npu', activity_key='atividade', timestamp_key='mov_dtmov')
            eventLog = pm4py.convert_to_event_log(df_event_log)

            eventLogCache[cacheKey] = eventLog
            #limpa da cache depois de 10 minutos
            timer3.apply_after(1000 * 60 * 15, clear_eventlog_cache, args=([cacheKey]), priority=0)

    if eventLog is not None :
        if sensibility is not None :
            eventLog = pm4py.filter_variants_percentage(eventLog, percentage=float(sensibility) / 100)

    return eventLog

# Gera o DFG Model a partir do log de eventos
def gerar_dfg_model_from_log_eventos(eventLog):
    if eventLog is not None :
        #Create dfg model from log
        return dfg_discovery.apply(eventLog)
    else :
        return None

# Gera a visualização do modelo
def gerar_view_dfg_model(eventLog, dfg, metric_type = 'FREQUENCY', image_format = 'png'):
    gviz = None
    
    if metric_type == 'PERFORMANCE' :
        parameters = {dfg_visualization.Variants.PERFORMANCE.value.Parameters.FORMAT: image_format}
        # Visualise
        gviz = dfg_visualization.apply(dfg, log=eventLog, variant=dfg_visualization.Variants.PERFORMANCE, parameters=parameters)
    elif metric_type == 'FREQUENCY' :
        parameters = {dfg_visualization.Variants.FREQUENCY.value.Parameters.FORMAT: image_format}
        # Visualise
        gviz = dfg_visualization.apply(dfg, log=eventLog, variant=dfg_visualization.Variants.FREQUENCY, parameters=parameters)
    else :
        print("Invalid metric_type: " + metric_type)

    return gviz

# Gera a visualização do modelo com base nos parametros
def gerar_view_dfg_model_from_params(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, 
                                     dtinicio, dtfim, baixado = None, sensibility = '60', metric_type = 'FREQUENCY', image_format = 'png'):
    
    gviz = None
    
    eventLog = gerar_log_eventos(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, dtinicio, dtfim, baixado, sensibility)
    
    if eventLog is not None :
        dfg = gerar_dfg_model_from_log_eventos(eventLog)
        gviz = gerar_view_dfg_model(eventLog, dfg, metric_type, image_format)
    
    return gviz

# Gera as lista de previsoes de conclusao de um caso para o modelo do log de eventos
def gerar_previsoes_modelo_from_log_eventos(eventLog):
    
    dfg_perf = dfg_discovery.apply(eventLog, variant=dfg_discovery.Variants.PERFORMANCE)

    sa = start_activities.get_start_activities(eventLog)
    ea = end_activities.get_end_activities(eventLog)

    reach_graph, tang_reach_graph, stochastic_map, q_matrix = ctmc.get_tangible_reachability_and_q_matrix_from_dfg_performance(dfg_perf, parameters={"start_activities": sa, "end_activities": ea})

    intervalo_um_dia_em_segundos = 60 * 60 * 24
    intervalos = [
        intervalo_um_dia_em_segundos * 30,
        intervalo_um_dia_em_segundos * 60,
        intervalo_um_dia_em_segundos * 90,
        intervalo_um_dia_em_segundos * 180,
        intervalo_um_dia_em_segundos * 365,
        intervalo_um_dia_em_segundos * 365 * 2,
        intervalo_um_dia_em_segundos * 365 * 3,
        intervalo_um_dia_em_segundos * 365 * 4,
        intervalo_um_dia_em_segundos * 365 * 5,
        intervalo_um_dia_em_segundos * 365 * 6,
        intervalo_um_dia_em_segundos * 365 * 7,
        intervalo_um_dia_em_segundos * 365 * 8,
        intervalo_um_dia_em_segundos * 365 * 9,
        intervalo_um_dia_em_segundos * 365 * 10
    ]

    previsoes_por_intervalo = []

    # pick the source state
    initial_state = [x for x in tang_reach_graph.states if x.name == "source1"][0]
    final_state = [x for x in tang_reach_graph.states if x.name == "sink1"][0]

    for intervalo in intervalos:
        # analyse the distribution over the states of the system starting from the source after 172800.0 seconds (2 days)
        transient_result = ctmc.transient_analysis_from_tangible_q_matrix_and_single_state(
            tang_reach_graph, q_matrix, initial_state, intervalo)

        for key, value in filter(lambda elem: elem[0].name == "sink1", transient_result.items()):
            previsoes_por_intervalo.append({
                "intervaloEmDias": intervalo / intervalo_um_dia_em_segundos,
                "probabilidadeDeTermino": float(value)
            })

    
    return previsoes_por_intervalo

# Gera as lista de previsoes de conclusao de um caso para o modelo por parametros
def gerar_previsoes_modelo_from_params(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, 
                                     dtinicio, dtfim, baixado = None, sensibility = '60'):
    
    eventLog = gerar_log_eventos(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, 
                                 dtinicio, dtfim, baixado, sensibility)
    
    previsoes_por_intervalo = gerar_previsoes_modelo_from_log_eventos(eventLog)
    
    return previsoes_por_intervalo


class ModeloEstatisticas:

    def __init__(self, qtde_casos, caso_dur_min, caso_dur_max, caso_dur_media, \
                 taxa_chegada_casos, taxa_dispersao_casos, previsoes_termino):
        self.qtde_casos = qtde_casos
        self.caso_dur_min = caso_dur_min
        self.caso_dur_max = caso_dur_max
        self.caso_dur_media = caso_dur_media
        self.taxa_chegada_casos = taxa_chegada_casos
        self.taxa_dispersao_casos = taxa_dispersao_casos
        self.previsoes_termino = previsoes_termino

class FileRemover(object):
    def __init__(self):
        self.weak_references = dict()  # weak_ref -> filepath to remove

    def cleanup_once_done(self, response, filepath):
        wr = weakref.ref(response, self._do_cleanup)
        self.weak_references[wr] = filepath

    def _do_cleanup(self, wr):
        filepath = self.weak_references[wr]
        print('Deleting %s' % filepath)
        shutil.rmtree(filepath, ignore_errors=True)

# Gera as estatisticas do modelo
def gerar_estatisticas_model_from_log_eventos(eventLog):

    parameters_stats = {
        case_statistics.Parameters.TIMESTAMP_KEY: "time:timestamp"
    }
    
    # (quantidade de casos no event log)
    all_case_durations = case_statistics.get_all_casedurations(eventLog, parameters=parameters_stats)
    # (duração do caso mais rápido)
    min_case_duration = min(all_case_durations)
    # (duração do caso mais demorado)
    max_case_duration = max(all_case_durations)
    # (média de duração dos casos)
    median_case_duration = case_statistics.get_median_caseduration(eventLog, parameters=parameters_stats)
    
    parameters_arrival = {
        case_arrival.Parameters.TIMESTAMP_KEY: "time:timestamp"
    }

    # (distância média entre a chegada de dois casos consecutivos)
    case_arrival_ratio = case_arrival.get_case_arrival_avg(eventLog, parameters=parameters_arrival)
    # (distância média entre a finalização de dois casos consecutivos)
    case_dispersion_ratio = case_arrival.get_case_dispersion_avg(eventLog, parameters=parameters_arrival)
    
    previsoes = gerar_previsoes_modelo_from_log_eventos(eventLog)
    
    return ModeloEstatisticas(qtde_casos=len(all_case_durations), caso_dur_min=min_case_duration, caso_dur_max=max_case_duration,
                              caso_dur_media=median_case_duration, taxa_chegada_casos=case_arrival_ratio, 
                              taxa_dispersao_casos=case_dispersion_ratio,previsoes_termino=previsoes)


# Gera as estatisticas do modelo com base nos parametros
def gerar_estatistica_model_from_params(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, 
                                     dtinicio, dtfim, baixado = None, sensibility = '60'):
    
    est_model = None
    
    eventLog = gerar_log_eventos(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, dtinicio, dtfim, baixado, sensibility)
    
    if eventLog is not None :
        est_model = gerar_estatisticas_model_from_log_eventos(eventLog)
    
    return est_model

# consulta os orgaos julgadores por tribunal e atuacao da vara
def consultar_orgaosjulgadores_por_tribunal_e_atuacaovara(codtribunal, atuacao):
    
    conn = psycopg2.connect(host=db_host, port=db_port, database=db_name, user=db_user, password=db_pass)

    qry = "SELECT "
    qry+= "  cod, "
    qry+= "  descricao "
    qry+= "FROM inovacnj.orgao_julgador oj "
    qry+= "WHERE (1=1) "

    if codtribunal is not None :
        qry+= "AND oj.codtribunal = '" + codtribunal + "' "
    if atuacao is not None :
        qry+= "AND oj.atuacao_vara = '" + atuacao + "' "

    qry+= "ORDER BY descricao ASC"
    
    df = pd.read_sql_query(qry, conn)
    
    return df

# executa um token replay em um log de eventos
def get_token_replayed_traces_from_params(net, initial_marking, final_marking,
                             ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, 
                             dtinicio, dtfim, baixado = None, sensibility = '60'):
    eventLog_oj = gerar_log_eventos(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, dtinicio, dtfim, baixado, sensibility)
    replayed_traces = token_replay.apply(eventLog_oj, net, initial_marking, final_marking)
   
    return replayed_traces

# Gera as lista de orgao julgadores com o percentual de compatibilidade com o modelo
def gerar_orgaosjulgadores_modelfit_from_params(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, 
                                     dtinicio, dtfim, baixado = None, sensibility = '60'):
    
    eventLog = gerar_log_eventos(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, 
                                 dtinicio, dtfim, baixado, sensibility)
    net, initial_marking, final_marking = alpha_miner.apply(eventLog)
    
    orgaos_model_fit = []
    
    df = consultar_orgaosjulgadores_por_tribunal_e_atuacaovara(codtribunal, atuacao)
    
    with ThreadPoolExecutor(max_workers = 15) as executor:
        
        future_to_row = {executor.submit(
                            get_token_replayed_traces_from_params, 
                            net, initial_marking, final_marking,
                             ramo_justica, codtribunal, atuacao, grau, str(row["cod"]), codnatureza, codclasse, 
                             dtinicio, dtfim, baixado, sensibility): row for index, row in df.iterrows()}
        for future in concurrent.futures.as_completed(future_to_row):
            row = future_to_row[future]
            try:
                replayed_traces = future.result()
                orgao_model_fit = {
                  "cod": row["cod"],
                  "descricao": row["descricao"],
                  "traceFitness": str(replayed_traces[0]['trace_fitness'] * 100) + ' %',
                  "traceIsFit": replayed_traces[0]['trace_is_fit']
                }
                orgaos_model_fit.append(orgao_model_fit)
            except Exception as exc:
                print('%r generated an exception: %s' % (row, exc))
    
    sorted_orgaos_model_fit = sorted(orgaos_model_fit, key = lambda i: i['traceFitness'], reverse=True)
    
    return sorted_orgaos_model_fit