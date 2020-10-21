export class Alerta {
    // Raw attributes
    nme: string = null;
    valor: string = null;
    
    static fromJson(json: any): Alerta {
        let entity: Alerta = null;
        if (json) {
            entity = new Alerta();
            entity.nme = json.nome;
            entity.valor = json.valor;
        }
        return entity;
    }

    static toArray(jsonArray: any[]): Alerta[] {
        let entities: Alerta[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = Alerta.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
