export class Tribunal {
    // Raw attributes
    codigo: string = null;
    descricao: string = null;
    sigla: string = null;
    tipo: string = null;
    porte: string = null;

    static fromJson(json: any[]): Tribunal {
        let entity: Tribunal = null;
        if (json) {
            entity = new Tribunal();
            entity.codigo = json[0];
            entity.descricao = json[1];
            entity.sigla = json[2];
            entity.tipo = json[3];
            entity.porte = json[4];
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): Tribunal[] {
        let entities: Tribunal[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = Tribunal.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
