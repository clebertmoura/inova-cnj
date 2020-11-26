import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { TipoJustica } from '../../models/tipo-justica';
import { Tribunal } from 'app/models/tribunal';
import { Natureza } from 'app/models/natureza';
import { Classe } from '../../models/classe';
import { FiltroPm, ImageFormatPm, MetricaPm } from 'app/models/filtro-pm';
import { ProcessoPredict } from 'app/models/processo-predict';
import { OrgaoJulgador } from 'app/models/orgao-julgador';
import { Movimento } from 'app/models/movimento';
import { AssuntoRanking } from '../../models/assunto-ranking';
import { Fase } from 'app/models/fase';
import { AtuacaoOrgaoJulgador } from 'app/models/atuacao-orgaojulgador';
import { ModelFitnessOrgaoJulgador } from '../../models/modelfitness-orgao-julgador';
import { Cluster } from '../../models/cluster';

@Injectable({
    providedIn: 'root'
})
export class InovacnjService {

    private url = '/api';
    
    constructor(protected http: HttpClient) {
    }

    // Headers
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    public consultarNpuPredict(npu): Observable<ProcessoPredict> {
        const link  = '/service/processos/';
        return this.http.get<any[]>(link + npu)
        .pipe(
            retry(1),
            map((response : any) => {
                if (response.mensagem === "OK") {
                    return ProcessoPredict.fromJson(response);
                } else {
                    return null;
                }
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna uma coleção de TipoJustica
     */
    public consultarTipoJustica(): Observable<TipoJustica[]> {
        console.log(this.url + '/v1/tipo-justica');
        return this.http.get<any[]>(this.url + '/v1/tipo-justica')
        .pipe(
            retry(1),
            map((response : any) => {
                return TipoJustica.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna uma coleção de Tribunal
     */
    public consultarTribunal(tipoJustica?: TipoJustica): Observable<Tribunal[]> {
        return this.http.get<any[]>(this.url + '/v1/tribunal' + (tipoJustica != null ? `?tipo=${tipoJustica.codigo}` : ''))
        .pipe(
            retry(1),
            map((response : any) => {
                return Tribunal.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna uma coleção de Natureza
     */
    public consultarNatureza(tipoJustica?: TipoJustica): Observable<Natureza[]> {
        return this.http.get<any[]>(this.url + '/v1/natureza' + (tipoJustica != null ? `?tipo=${tipoJustica.codigo}` : ''))
        .pipe(
            retry(1),
            map((response : any) => {
                return Natureza.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna uma coleção de Classe
     */
    public consultarClasse(natureza?: Natureza): Observable<Classe[]> {
        return this.http.get<any[]>(this.url + '/v1/classe'  + (natureza != null ? `?natureza=${natureza.codigo}` : ''))
        .pipe(
            retry(1),
            map((response : any) => {
                return Classe.toArray(response);
            }),
            catchError(() => of(null))
        );
    }
    /**
     * Retorna uma coleção de Movimento
     */
    public consultarMovimento(): Observable<Movimento[]> {
        return this.http.get<any[]>(this.url + '/v1/movimento')
        .pipe(
            retry(1),
            map((response : any) => {
                console.log(response);
                return Movimento.toArray(response);
            }),
            catchError(() => of(null))
        );

    }

    /**
     * Retorna uma coleção de Movimento
     */
    public consultarOrgaoJulgador(tribunal?: Tribunal): Observable<OrgaoJulgador[]> {
        return this.http.get<any[]>(this.url + '/v1/orgao-julgador?' + (tribunal != null ? `&codtribunal=${tribunal.codigo}` : ''))
        .pipe(
            retry(1),
            map((response : any[][]) => {
                return OrgaoJulgador.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna uma coleção de Cluster
     */
    public consultarCluster(tipoJustica?: TipoJustica, atuacao?: AtuacaoOrgaoJulgador): Observable<Cluster[]> {
        return this.http.get<any[]>(this.url + '/v1/cluster?' 
            + (tipoJustica != null ? `&ramojustica=${tipoJustica.codigo}` : '')
            + (atuacao != null ? `&atuacao=${atuacao.codigo}` : ''))
        .pipe(
            retry(1),
            map((response : any[][]) => {
                return Cluster.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    public consultarAtuacaoOrgaoJulgador(tipoJustica?: TipoJustica, tribunal?: Tribunal): Observable<AtuacaoOrgaoJulgador[]> {
        return this.http.get<any[]>(this.url + '/v1/atuacao-orgaojulgador?' 
                                            + (tipoJustica != null ? `&ramojustica=${tipoJustica.codigo}` : '')
                                            + (tribunal != null ? `&codtribunal=${tribunal.codigo}` : ''))
        .pipe(
            retry(1),
            map((response : any[][]) => {
                return AtuacaoOrgaoJulgador.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna uma coleção de Movimento
     */
    public consultarAssuntoRanking(tipoJustica?: TipoJustica, 
            tribunal?: Tribunal, orgaoJulgador?: OrgaoJulgador, 
            natureza?: Natureza, classe?: Classe): Observable<AssuntoRanking[]> {
        return this.http.get<any[]>(this.url + '/v1/assuntos-ranking?' 
            + (tipoJustica != null ? `&tipo=${tipoJustica.codigo}` : '')
            + (tribunal != null ? `&codtribunal=${tribunal.codigo}` : '')
            + (orgaoJulgador != null ? `&codorgaoj=${orgaoJulgador.codigo}` : '')
            + (natureza != null ? `&natureza=${natureza.codigo}` : '')
            + (classe != null ? `&codclasse=${classe.codigo}` : '')
        )
        .pipe(
            map((response : any[][]) => {
                return AssuntoRanking.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna um Modelo
     */
    public getUrlModeloPm(filtro: FiltroPm): string {
        const urlPm = FiltroPm.buildUrlModeloPm(filtro, this.url);
        console.log(urlPm)
        return urlPm;
    }

    public getUrlEstatisticaModeloPm(filtro: FiltroPm): string {
        const urlPm = FiltroPm.buildUrlEstatisticaModeloPm(filtro, this.url);
        console.log(urlPm)
        return urlPm;
    }

    private converterTempo(segundos: number): string {
        if (segundos < 60) {
            return segundos + " segundos";
        } else if (segundos < 3600) {
            return (segundos/60).toFixed(2) + " minutos";
        } else if (segundos < 86400) {
            return (segundos/3600).toFixed(2) + " horas";
        } else {
            return (segundos/86400).toFixed(0) + " dias";
        }
    }
    private converterDiaParaAno(dias: number): string {
        if (dias < 365) {
            return "" + dias;
        } else if (dias >= 365 && dias < 730) {
            return "1 ano";
        } else if (dias >= 730 && dias < 1095) {
            return "2 anos";
        } else if (dias >= 1095 && dias < 1460) {
            return "3 anos";
        } else if (dias >= 1460 && dias < 1825) {
            return "4 anos";
        } else if (dias >= 1825 && dias < 2190) {
            return "5 anos";
        } else if (dias >= 2190 && dias < 2555) {
            return "6 anos";
        } else if (dias >= 2555 && dias < 2920) {
            return "7 anos";
        } else if (dias >= 2920 && dias < 3285) {
            return "8 anos";
        } else if (dias >= 3285 && dias < 3650) {
            return "9 anos";
        } else if (dias >= 3650) {
            return "10 anos";
        } 
    }

    public consultarEstatisticaModeloPm(filtro: FiltroPm): Observable<any> {
        return this.http.get<any[]>(filtro.urlEstatistica)
        .pipe(
            retry(1),
            map((response : any) => {
                let dados: any[] = [];
                    if (response.previsoes_termino != null && response.previsoes_termino.length > 0) {
                        response.previsoes_termino.forEach(item => {
                            let entity = {
                                'name' : this.converterDiaParaAno(item.intervaloEmDias),
                                'value' : (item.probabilidadeDeTermino*100).toFixed(2),
                            };
                            dados.push(entity);
                        });
                    }
                let entities = { 
                    'estatistica' : [
                    {
                        'campo' : 'Quantidade de processos no modelo',
                        'valor' : response.qtde_casos,
                    },
                    {
                        'campo' : 'Duração do processo mais rápido',
                        'valor' : this.converterTempo(response.caso_dur_min),
                    },
                    {
                        'campo' : 'Duração do processo mais demorado',
                        'valor' : this.converterTempo(response.caso_dur_max),
                    },
                    {
                        'campo' : 'Duração média de um processo',
                        'valor' : this.converterTempo(response.caso_dur_media),
                    },
                    {
                        'campo' : 'Intervalo médio entre a chegada de um processo e outro',
                        'valor' : this.converterTempo(response.taxa_chegada_casos),
                    },
                    {
                        'campo' : 'Tempo médio de finalização entre processos',
                        'valor' : this.converterTempo(response.taxa_dispersao_casos),
                    },],
                    'grafico' : dados,
                };
                return entities;
            }),
            catchError(() => of(null))
        );
    }

    public consultarOrgaosJulgadoresModelFit(filtro: FiltroPm): Observable<ModelFitnessOrgaoJulgador[]> {
        return this.http.get<any[]>(FiltroPm.buildUrlOrgaoJulgadoresModelFit(filtro))
        .pipe(
            retry(1),
            map((response : any[][]) => {
                return ModelFitnessOrgaoJulgador.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    // sample method from angular doc
    protected handleError(httpError: HttpErrorResponse) {
        console.error('Ocorreu erro na requisição:', httpError);
        if (httpError.status >= 401 && httpError.status <= 403) {
            window.location.href = '/';
        }
        return observableThrowError(httpError);
    }

    public salvarFase(fase: Fase): Observable<Fase> {
        return this.http.post<Fase>(this.url + "/v1/fase", JSON.stringify(fase), this.httpOptions)
        .pipe(
            retry(2),
            map((response : any) => {
                return Fase.fromJson(response);
            }),
            catchError(this.handleError)
        )
    }
    
    public atualizarFase(fase: Fase): Observable<Fase> {
        return this.http.put<Fase>(this.url + "/v1/fase" + '/' + fase.codigo, JSON.stringify(fase), this.httpOptions)
        .pipe(
            retry(1),
            map((response : any) => {
                return Fase.fromJson(response);
            }),
            catchError(this.handleError)
        )
    }
  
    public deletarFase(fase: Fase) {
        return this.http.delete<Fase>(this.url + "/v1/fase" + '/' + fase.codigo, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.handleError)
        )
    }

    public consultarFase(codigo): Observable<Fase> {
        return this.http.get<any[]>(this.url + "/v1/fase" + '/' + codigo)
        .pipe(
            retry(1),
            map((response : any) => {
                return Fase.fromJson(response);
            }),
            catchError(() => of(null))
        );
    }

    public consultarFases(): Observable<Fase[]> {
        return this.http.get<any[]>(this.url + "/v1/fase")
        .pipe(
            retry(1),
            map((response : any) => {
                return Fase.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

}

