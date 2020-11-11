export class Fase {
    // Raw attributes
    codigo: number = null;
    nome: string = null;
    descricao: string = null;
    
    static fromJson(json: any): Fase {
        let entity: Fase = null;
        if (json) {
            entity = new Fase();
            entity.codigo = json.id;
            entity.nome = json.nome;
            entity.descricao = json.descricao;
        }
        return entity;
    }

    static toArray(jsonArray: any[]): Fase[] {
        let entities: Fase[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = Fase.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
