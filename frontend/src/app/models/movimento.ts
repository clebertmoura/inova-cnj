export class Movimento {
    // Raw attributes
    codigo: number = null;
    descricao: string = null;
    ativo: string = null;
    codigoCompleto: string = null;
    descricaoCompleta: string = null;
    fase: string = null;
    
    static fromJson(json: any): Movimento {
        let entity: Movimento = null;
        if (json) {
            entity = new Movimento();
            entity.codigo = json.cod;
            entity.descricao = json.descricao;
            entity.ativo = json.ativo;
            entity.codigoCompleto = json.cod_completo;
            entity.descricaoCompleta = json.descricao_completa;
            entity.fase = json.fase;
        }
        return entity;
    }

    static toArray(jsonArray: any[]): Movimento[] {
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
