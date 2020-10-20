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

    static fromJson(json: any[]): ProcessoPredict {
        let entity: ProcessoPredict = null;
        if (json) {
            entity = new ProcessoPredict();
            entity.processo = json[1][0];
            entity.siglaTribunal = json[1][1];
            entity.orgaoJulgador = json[1][2];
            entity.natureza = json[1][3];
            entity.classe = json[1][4];
            entity.assunto = json[1][5];
            entity.dataAjuizamento = json[1][6];
            entity.porteTribunal = json[1][7];
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): ProcessoPredict[] {
        let entities: ProcessoPredict[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = ProcessoPredict.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
