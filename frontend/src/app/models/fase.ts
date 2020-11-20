import { NAMED_ENTITIES } from '@angular/compiler';
import { Movimento } from './movimento';
import { Tribunal } from './tribunal';

export class Fase {
    // Raw attributes
    codigo: number = null;
    descricao: string = null;
    cod_tribunal: string = null;
    tribunal: Tribunal = null;
    movimentos: Movimento[] = [];
    movimentosListaString: string = null;
    
    static fromJson(json: any): Fase {
        let entity: Fase = null;
        if (json) {
            entity = new Fase();
            entity.codigo = json.cod;
            entity.descricao = json.descricao;
            entity.cod_tribunal = json.cod_tribunal;
            entity.tribunal = Tribunal.fromJson(json.tribunal);
            entity.movimentos = Movimento.toArray(json.movimentos);
            entity.movimentosListaString = this.movimentosToString(json.movimentos);
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

    static movimentosToString(movimentos: any): string {
        let retorno: string = "";
        movimentos.forEach(item => {
            retorno = retorno + "<p>" + item.cod + " - " + item.descricao + "</p> ";
        });
        return retorno;
    }
    
}
