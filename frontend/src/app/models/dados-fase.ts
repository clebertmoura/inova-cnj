export class DadosFase {
    // Raw attributes
    nome: string = null;
    duracao: string = null;
    duracaoPrevista: string = null;
    status: string = null;
    
    static fromJson(json: any): DadosFase {
        let entity: DadosFase = null;
        if (json) {
            entity = new DadosFase();
            entity.nome = json.nome;
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
