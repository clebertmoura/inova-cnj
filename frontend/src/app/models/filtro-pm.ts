import { Classe } from './classe';
import { Natureza } from './natureza';
import { Tribunal } from './tribunal';
import { OrgaoJulgador } from './orgao-julgador';

export class FiltroPm {

    constructor(
        public tribunal: Tribunal, public orgaoJulgador: OrgaoJulgador, public natureza: Natureza, 
        public classe: Classe, public sensibilidade: number = 60,
        public maximized: boolean = false
    ) { }
}
