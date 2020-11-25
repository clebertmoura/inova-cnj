export class ModelFitnessOrgaoJulgador {
    // Raw attributes
    codigo: number = null;
    descricao: string = null;
    codigoTribunal: string = null;
    tipo: string = null;
    atuacao: string = null;
    traceFitness: number;
    
    static fromJson(json: any[]): ModelFitnessOrgaoJulgador {
        let entity: ModelFitnessOrgaoJulgador = null;
        if (json) {
            entity = new ModelFitnessOrgaoJulgador();
            entity.codigo = json[0];
            entity.descricao = json[1];
            entity.codigoTribunal = json[2];
            entity.tipo = json[3];
            entity.atuacao = json[4];
            entity.traceFitness = json[5] * 100;
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): ModelFitnessOrgaoJulgador[] {
        let entities: ModelFitnessOrgaoJulgador[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = ModelFitnessOrgaoJulgador.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
