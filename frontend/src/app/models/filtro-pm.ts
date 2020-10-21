import { Classe } from './classe';
import { Natureza } from './natureza';
import { Tribunal } from './tribunal';

export class FiltroPm {

    constructor(
        public tribunal: Tribunal, public natureza: Natureza, public classe: Classe, public sensibilidade: number = 100
    ) { }
}
