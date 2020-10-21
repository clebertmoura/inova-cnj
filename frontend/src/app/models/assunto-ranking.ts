export class AssuntoRanking {
    // Raw attributes
    descricao: string = null;
    ranking: number = null;

    static fromJson(json: any[]): AssuntoRanking {
        let entity: AssuntoRanking = null;
        if (json) {
            entity = new AssuntoRanking();
            entity.descricao = json[0];
            entity.ranking = json[1];
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): AssuntoRanking[] {
        let entities: AssuntoRanking[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = AssuntoRanking.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
