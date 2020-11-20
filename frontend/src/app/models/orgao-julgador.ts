export class OrgaoJulgador {
    // Raw attributes
    codigo: number = null;
    tipo: string = null;
    descricao: string = null;
    codigoTribunal: string = null;
    
    static fromJson(json: any[]): OrgaoJulgador {
        let entity: OrgaoJulgador = null;
        if (json) {
            entity = new OrgaoJulgador();
            entity.codigo = json[0];
            entity.tipo = json[1];
            entity.descricao = json[2];
            entity.codigoTribunal = json[3];
        }
        return entity;
    }

    static toArray(jsonArray: any[][]): OrgaoJulgador[] {
        let entities: OrgaoJulgador[] = [];
        if (jsonArray != null && jsonArray.length > 0) {
            jsonArray.forEach(item => {
                let entity = OrgaoJulgador.fromJson(item);
                entities.push(entity)
            });
        }
        return entities;
    }
    
}
