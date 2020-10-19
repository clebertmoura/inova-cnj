export class Classe {
    // Raw attributes
    codigo: string = null;
    descricao: string = null;
    sigla: string = null;

    static fromJson(json: any[]): Classe {
        let entity: Classe = null;
        if (json) {
            entity = new Classe();
            entity.codigo = json[0];
            entity.descricao = json[1];
            entity.sigla = json[2];
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): Classe[] {
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
