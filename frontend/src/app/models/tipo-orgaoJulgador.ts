import { OrgaoJulgador } from './orgao-julgador';

export class TipoOrgao {
    tipo: string;
    orgaos: OrgaoJulgador[];
  
    static criarTipoOrgao(data: OrgaoJulgador[]):TipoOrgao[] {
      let tipos: string[] = [];
        let tiposOrgao: TipoOrgao[] = [];
        let indice = -1
        if (data != null && data.length > 0) {
          data.forEach(element => {
            if (tipos != null && tipos.length > 0) {
              indice = tipos.indexOf(element.tipo);
            } 
            if(indice > -1) {
              //existe
              tiposOrgao[indice].orgaos.push(element)
            } else {
              //novo
              let t: TipoOrgao = new TipoOrgao();
              t.tipo = element.tipo;
              t.orgaos = [];
              t.orgaos.push(element);
              tiposOrgao.push(t);
              tipos.push(element.tipo);
            }
          });
        }
        return tiposOrgao;
    }
  }