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

@Injectable({
    providedIn: 'root'
})
export class InovacnjService {

    private url = '/api';

    predict = {
        mensagem:"OK",
        resultado: {
            processo:"12131231231231",
            siglaTribunal:"TJPE",
            orgaoJulgador:"1a Vara Criminal",
            Natureza:"Criminal",
            classe:"abcd",
            assunto:"safasdfa",
            dataAjuizamento:"01/03/2000",
            porteTribunal:"Médio",
            historicoFases:[
                {
                    nome:"F1",
                    situacao:"Concluído",
                    dataConclusao:"10/05/2011",
                    dataInicio:"01/03/2000"
                },
                {
                    nome:"F2",
                    situacao:"Em andamento",
                    dataConclusao:"",
                    dataInicio:"01/03/2000"
                },
                {
                    nome:"F3",
                    situacao:"Não Realizada",
                    dataConclusao:"",
                    dataInicio:""
                }
            ],
            dadosFases:[
                {
                    id:"1",
                    duracao:23,
                    duracaoPrevista:434,
                    status: "Concluído"
                },
                {
                    id:"2",
                    duracao:45,
                    duracaoPrevista:67,
                    status: "Em andamento"
                },
                {
                    id:"3",
                    duracao:-1,
                    duracaoPrevista:121,
                    status: "Não realizada"
                }
            ],
            alertas:[
                {
                    nome:"Probabilidade de Duração atípica (5% dos processos mais demorados de mesma natureza)",
                    valor:"78%"
                },
                {
                    nome:"Duração total estimada do processo",
                    valor:"432 dias"
                },
                {
                    nome:"Posição calculada da tribunal dentre os demais para a mesma classe baseado na duração média",
                    valor:"13 de 27"
                },
                {
                    nome:"Posição calculada da tribunal dentre os demais de mesmo porte para a mesma classe baseado na duração média",
                    valor:"4 de 13"
                },
                {
                    nome:"Posição calculada do orgão julgador dentre os demais do mesmo tribunal para a mesma classe baseado na duração média",
                    valor:"8 de 13"
                }
            ]
        }
    }

    constructor(protected http: HttpClient) {
    }

    getHistoricoFases() {
        return this.predict.resultado.historicoFases;
    }

    getAlertas() {
        return this.predict.resultado.alertas;
    }

    getDadosFases() {
        return this.predict.resultado.dadosFases
    }

    getExisteNpu(npu) {
        if (this.predict.resultado.processo === npu) {
            return true;
        } else 
            return false;

    }
    public pesquisarAnalitcs(dataInicial, dataFinal, tipoJustica, tribunal, natureza, classe) {
        const analitcs = {
            mensagem:"OK",
            resultado: [
                    {
                        natureza:"A",
                        classe:"Classe A",
                        duracaoMedia:"Linha comparativa",
                        faseMaisDemorada:"F1",
                        assuntoMaisDemorado:"Assunto X"
                    },
                    {
                        natureza:"B",
                        classe:"Classe B",
                        duracaoMedia:"Linha comparativa",
                        faseMaisDemorada:"F2",
                        assuntoMaisDemorado:"Assunto X"
                    },
                    {
                        natureza:"C",
                        classe:"Classe C",
                        duracaoMedia:"Linha comparativa",
                        faseMaisDemorada:"F3",
                        assuntoMaisDemorado:"Assunto H"
                    },
                ],
            }
        return analitcs.resultado;
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
    public consultarTribunal(): Observable<Tribunal[]> {
        return this.http.get<any[]>(this.url + '/v1/tribunal')
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
     * Retorna uma coleção de Natureza
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

