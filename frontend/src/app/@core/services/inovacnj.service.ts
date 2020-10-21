import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TipoJustica } from '../../models/tipo-justica';
import { Tribunal } from 'app/models/tribunal';
import { Natureza } from 'app/models/natureza';
import { Classe } from '../../models/classe';
import { FiltroPm } from 'app/models/filtro-pm';
import { ProcessoPredict } from 'app/models/processo-predict';
import { OrgaoJulgador } from 'app/models/orgao-julgador';
import { Movimento } from 'app/models/movimento';

@Injectable({
    providedIn: 'root'
})
export class InovacnjService {

    //private url = 'https://cors-anywhere.herokuapp.com/http://161.97.71.108:8181/api';
    private url = '/api';

    constructor(protected http: HttpClient) {
    }

    public consultarNpuPredict(npu): Observable<ProcessoPredict> {
        const link  = '/service/processos/';
        console.log(link + npu);
        return this.http.get<any[]>(link + npu)
        //return this.http.get<any[]>(this.url + '/service/processos/' + npu)
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
        return this.http.get<any[]>(this.url + '/v1/tribunal' + (tipoJustica != null ? `&tipo=${tipoJustica.codigo}` : ''))
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
            map((response : any[][]) => {
                return Movimento.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna uma coleção de Movimento
     */
    public consultarOrgaoJulgador(tribunal?: Tribunal): Observable<OrgaoJulgador[]> {
        return this.http.get<any[]>(this.url + '/v1/orgao-julgador' + (tribunal != null ? `&codtribunal=${tribunal.codigo}` : ''))
        .pipe(
            map((response : any[][]) => {
                return OrgaoJulgador.toArray(response);
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Retorna um Modelo
     */
    public getUrlModeloPm(filtro: FiltroPm): string {
        const urlPm = this.url + `/v1/gerar-modelo-pm?codtribunal=${filtro.tribunal.codigo}&natureza=${filtro.natureza.codigo}${filtro.classe != null ? '&codclasse=' + filtro.classe.codigo : ''}`;
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

}

