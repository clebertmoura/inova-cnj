import { Alerta } from './alerta';
import { DadosFase } from './dados-fase';
import { HistoricoFase } from './historico-fase';

export class ProcessoPredict {
    // Raw attributes
    processo: string = null;
    siglaTribunal: string = null;
    orgaoJulgador: string = null;
    natureza: string = null;
    classe: string = null;
    assunto: string = null;
    dataAjuizamento: string = null;
    porteTribunal: string = null;
    historicoFases: HistoricoFase[] = [];
    dadosFases: DadosFase[] = [];
    alertas: Alerta[] = [];

    static fromJson(json: any): ProcessoPredict {
        let entity: ProcessoPredict = null;
        if (json) {
            entity = new ProcessoPredict();
            entity.processo = json.resultado.processo;
            entity.siglaTribunal = json.resultado.siglaTribunal;
            entity.siglaTribunal = json.resultado.siglaTribunal;
            entity.natureza = json.resultado.natureza;
            entity.classe = json.resultado.classe;
            entity.assunto = json.resultado.assunto;
            entity.dataAjuizamento = json.resultado.dataAjuizamento;
            entity.porteTribunal = json.resultado.porteTribunal;
            entity.historicoFases = json.resultado.historicoFases;
            entity.dadosFases = json.resultado.dadosFases;
            entity.alertas = json.resultado.alertas;
        }
        return entity;
    }

    static toArray(jsonArray: any[]): ProcessoPredict[] {
        let entities: ProcessoPredict[] = [];
        console.log(jsonArray.length);
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = ProcessoPredict.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
