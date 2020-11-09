import { Classe } from './classe';
import { Natureza } from './natureza';
import { Tribunal } from './tribunal';
import { OrgaoJulgador } from './orgao-julgador';

export enum MetricaPm {
    Frequency = "FREQUENCY",
    Performance = "PERFORMANCE"
}

export enum ImageFormatPm {
    SVG = "svg",
    PNG = "png"
}

export class FiltroPm {

    public url: string = '';
    public loaded: boolean = false;
    public maximized: boolean = false;
    public metrica: MetricaPm = MetricaPm.Frequency;
    public formato: ImageFormatPm = ImageFormatPm.SVG;
    public svgContent: any;
    public svgObject: any;

    constructor(
        public tribunal: Tribunal, public orgaoJulgador: OrgaoJulgador, public natureza: Natureza, 
        public classe: Classe, public sensibilidade: number = 60
    ) {
        this.updateUrl();
    }

    updateUrl() {
        this.url = FiltroPm.buildUrlModeloPm(this);
    }

    /**
     * Retorna um Modelo
     */
    public static buildUrlModeloPm(filtro: FiltroPm, prefixApi: string = '/api'): string {
        const urlPm = prefixApi + 
            `/v1/gerar-modelo-pm?${filtro.tribunal != null ? '&codtribunal=' + filtro.tribunal.codigo : ''}${filtro.orgaoJulgador != null ? '&codorgaoj=' + filtro.orgaoJulgador.codigo : ''}${filtro.natureza != null ? '&natureza=' + filtro.natureza.codigo : ''}${filtro.classe != null ? '&codclasse=' + filtro.classe.codigo : ''}${filtro.sensibilidade != null ? '&sensibilidade=' + filtro.sensibilidade : '60'}${filtro.metrica != null ? '&metrica=' + filtro.metrica : MetricaPm.Frequency}${filtro.metrica != null ? '&formato=' + filtro.formato : ImageFormatPm.SVG}`;
        console.log(urlPm)
        return urlPm;
    }
}
