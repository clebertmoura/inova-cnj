export class Tribunal {
    // Raw attributes
    codigo: string = null;
    descricao: string = null;
    sigla: string = null;
    tipo: string = null;
    porte: string = null;
    latitude: number = null;
    longitude: number = null;
    coduf: number = null;
    uf: string = null;
    tipotribunal_oj: string = null;

    static fromJson(json: any): Tribunal {
        let entity: Tribunal = null;
        if (json) {
            entity = new Tribunal();
            entity.codigo = json.cod;
            entity.descricao = json.descricao;
            entity.sigla = json.sigla;
            entity.tipo = json.tipo;
            entity.porte = json.porte;
            entity.latitude = json.latitude;
            entity.longitude = json.longitude;
            entity.coduf = json.coduf;
            entity.uf = json.uf;
            entity.tipotribunal_oj = json.tipotribunal_oj;
        }
        return entity;
    }

    static toArray(jsonArray: any[]): Tribunal[] {
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
