import { Injectable } from '@angular/core';

@Injectable()
export class InovacnjService {

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


}

