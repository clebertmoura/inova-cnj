export class AtuacaoOrgaoJulgador {
    // Raw attributes
    codigo: string = null;
    descricao: string = null;
    tipo: string = null;
    
    static fromJson(json: any[]): AtuacaoOrgaoJulgador {
        let entity: AtuacaoOrgaoJulgador = null;
        if (json) {
            entity = new AtuacaoOrgaoJulgador();
            entity.codigo = json[0];
            entity.descricao = json[1];
            entity.tipo = json[2];
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): AtuacaoOrgaoJulgador[] {
        let entities: AtuacaoOrgaoJulgador[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = AtuacaoOrgaoJulgador.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
