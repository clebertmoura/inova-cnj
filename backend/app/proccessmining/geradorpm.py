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

import pm4py
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.conversion.dfg import converter as dfg_mining
from pm4py.algo.discovery.dfg import algorithm as dfg_discovery
from pm4py.algo.filtering.log.variants import variants_filter
from pm4py.visualization.dfg import visualizer as dfg_visualization
from pm4py.visualization.petrinet import visualizer as pn_visualizer
from pm4py.statistics.traces.log import case_statistics
from pm4py.statistics.traces.log import case_arrival

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
        qry+= "INNER JOIN inovacnj.orgao_julgador oj ON oj.cod = fat.oj_cod::integer "
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
            timer3.apply_after(1000 * 60 * 10, clear_eventlog_cache, args=([cacheKey]), priority=0)

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


class ModeloEstatisticas:

    def __init__(self, qtde_casos, caso_dur_min, caso_dur_max, caso_dur_media, \
                 taxa_chegada_casos, taxa_dispersao_casos):
        self.qtde_casos = qtde_casos
        self.caso_dur_min = caso_dur_min
        self.caso_dur_max = caso_dur_max
        self.caso_dur_media = caso_dur_media
        self.taxa_chegada_casos = taxa_chegada_casos
        self.taxa_dispersao_casos = taxa_dispersao_casos

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
    
    return ModeloEstatisticas(qtde_casos=len(all_case_durations), caso_dur_min=min_case_duration, caso_dur_max=max_case_duration, \
        caso_dur_media=median_case_duration, taxa_chegada_casos=case_arrival_ratio, taxa_dispersao_casos=case_dispersion_ratio)

# Gera as estatisticas do modelo com base nos parametros
def gerar_estatistica_model_from_params(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, 
                                     dtinicio, dtfim, baixado = None, sensibility = '60'):
    
    est_model = None
    
    eventLog = gerar_log_eventos(ramo_justica, codtribunal, atuacao, grau, codorgaoj, codnatureza, codclasse, dtinicio, dtfim, baixado, sensibility)
    
    if eventLog is not None :
        est_model = gerar_estatisticas_model_from_log_eventos(eventLog)
    
    return est_model