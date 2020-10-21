export class HistoricoFase {
    // Raw attributes
    nome: string = null;
    situacao: string = null;
    dataConclusao: string = null;
    dataInicio: string = null;
    
    static fromJson(json: any): HistoricoFase {
        let entity: HistoricoFase = null;
        if (json) {
            entity = new HistoricoFase();
            entity.nome = json.nome;
            entity.situacao = json.situacao;
            entity.dataConclusao = json.dataConclusao;
            entity.dataInicio = json.dataInicio;
        }
        return entity;
    }

    static toArray(jsonArray: any[]): HistoricoFase[] {
        let entities: HistoricoFase[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = HistoricoFase.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
