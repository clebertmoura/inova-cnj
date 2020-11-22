export class Classe {
    // Raw attributes
    codigo: string = null;
    descricao: string = null;
    sigla: string = null;
    codigoPai: string = null;
    filhos: Classe[] = [];

    static fromJson(json: any): Classe {
        let entity: Classe = null;
        if (json) {
            entity = new Classe();
            entity.codigo = json.cod;
            entity.descricao = json.descricao;
            entity.sigla = json.sigla;
            entity.codigoPai = json.codpai;
        }
        return entity;
    }

    static toArray(jsonArray: any[]): Classe[] {
        let entities: Classe[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = Classe.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
