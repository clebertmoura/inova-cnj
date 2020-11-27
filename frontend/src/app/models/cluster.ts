export class Cluster {
    // Raw attributes
    codigo: number = null;
    descricao: string = null;
    nome: string = null;
    
    static fromJson(json: any[]): Cluster {
        let entity: Cluster = null;
        if (json) {
            entity = new Cluster();
            entity.codigo = json[0];
            entity.descricao = json[1];
            entity.nome = json[2];
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): Cluster[] {
        let entities: Cluster[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = Cluster.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
