export class TipoJustica {
    // Raw attributes
    codigo: string = null;
    descricao: string = null;

    static fromJson(json: any[]): TipoJustica {
        let entity: TipoJustica = null;
        if (json) {
            entity = new TipoJustica();
            entity.codigo = json[0];
            entity.descricao = json[1];
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): TipoJustica[] {
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
