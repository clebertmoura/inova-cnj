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

@Injectable({
    providedIn: 'root'
})
export class InovacnjService {

    //private url = 'https://cors-anywhere.herokuapp.com/http://161.97.71.108:8181/api';
    private url = '/api';
    private urlFase = '/service/fases';

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
            map((response : any[][]) => {
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
            map((response : any[][]) => {
                return Tribunal.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna uma coleção de Natureza
     */
    public consultarNatureza(): Observable<Natureza[]> {
        return this.http.get<any[]>(this.url + '/v1/natureza')
        .pipe(
            map((response : any[][]) => {
                return Natureza.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna uma coleção de Classe
     */
    public consultarClasse(): Observable<Classe[]> {
        return this.http.get<any[]>(this.url + '/v1/classe')
        .pipe(
            map((response : any[][]) => {
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
        return this.http.get<any[]>(this.url + '/v1/orgao-julgador' + (tribunal != null ? `?codtribunal=${tribunal.codigo}` : ''))
        .pipe(
            map((response : any[][]) => {
                return OrgaoJulgador.toArray(response);
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
            //retry(2),
            map((response : any) => {
                return Fase.fromJson(response);
            }),
            catchError(this.handleError)
        )
    }
    
    public atualizarFase(fase: Fase): Observable<Fase> {
        return this.http.put<Fase>(this.url + "/v1/fase" + '/' + fase.codigo, JSON.stringify(fase), this.httpOptions)
        .pipe(
            //retry(1),
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
            map((response : any) => {
                return Fase.fromJson(response);
            }),
            catchError(() => of(null))
        );
    }

    public consultarFases(): Observable<Fase[]> {
        return this.http.get<any[]>(this.url + "/v1/fase")
        .pipe(
            map((response : any) => {
                return Fase.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

}

