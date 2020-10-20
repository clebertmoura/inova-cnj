export class DadosFase {
    // Raw attributes
    id: string = null;
    duracao: number = null;
    duracaoPrevista: number = null;
    status: string = null;
    
    static fromJson(json: any[]): DadosFase {
        let entity: DadosFase = null;
        if (json) {
            entity = new DadosFase();
            entity.id = json[0];
            entity.duracao = json[1];
            entity.duracaoPrevista = json[2];
            entity.status = json[3];
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): DadosFase[] {
        let entities: DadosFase[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = DadosFase.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
