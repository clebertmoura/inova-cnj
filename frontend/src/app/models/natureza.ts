export class Natureza {
    // Raw attributes
    codigo: string = null;
    descricao: string = null;

    static fromJson(json: any): Natureza {
        let entity: Natureza = null;
        if (json) {
            entity = new Natureza();
            entity.codigo = json.cod;
            entity.descricao = json.descricao;
        }
        return entity;
    }

    static toArray(jsonArray: any[]): Natureza[] {
        let entities: Natureza[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = Natureza.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
