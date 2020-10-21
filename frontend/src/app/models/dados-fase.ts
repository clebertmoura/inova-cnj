export class DadosFase {
    // Raw attributes
    id: string = null;
    duracao: number = null;
    duracaoPrevista: number = null;
    status: string = null;
    
    static fromJson(json: any): DadosFase {
        let entity: DadosFase = null;
        if (json) {
            entity = new DadosFase();
            entity.id = json.id;
            entity.duracao = json.duracao;
            entity.duracaoPrevista = json.duracaoPrevista;
            entity.status = json.status;
        }
        return entity;
    }

    static toArray(jsonArray: any[]): DadosFase[] {
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
