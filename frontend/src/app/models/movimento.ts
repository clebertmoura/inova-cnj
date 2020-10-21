export class Movimento {
    // Raw attributes
    codigo: string = null;
    descricao: string = null;
    natureza: string = null;
    fase: string = null;
    codigoPai: string = null;
    

    static fromJson(json: any[]): Movimento {
        let entity: Movimento = null;
        if (json) {
            entity = new Movimento();
            entity.codigo = json[0];
            entity.descricao = json[1];
            entity.natureza = json[2];
            entity.fase = json[3];
            entity.codigoPai = json[4];
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): Movimento[] {
        let entities: Movimento[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = Movimento.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
