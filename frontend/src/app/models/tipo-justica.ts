export class TipoJustica {
    // Raw attributes
    codigo: string = null;
    descricao: string = null;

    static fromJson(json: any): TipoJustica {
        let entity: TipoJustica = null;
        if (json) {
            entity = new TipoJustica();
            entity.codigo = json.cod;
            entity.descricao = json.descricao;
        }
        return entity;
    }

    static toArray(jsonArray: any[]): TipoJustica[] {
        let entities: TipoJustica[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = TipoJustica.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
