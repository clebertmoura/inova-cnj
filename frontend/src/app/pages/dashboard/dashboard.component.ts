import {Component, OnDestroy, ViewChild} from '@angular/core';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbThemeService } from '@nebular/theme';
import { SmartTableData } from 'app/@core/data/smart-table';
import { LocalDataSource } from 'ng2-smart-table';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnDestroy {
  
  predict = {
        mensagem:"OK",
        resultado: {
            processo:"12131231231231",
            siglaTribunal:"TJPE",
            orgaoJulgador:"1a Vara Criminal",
            Natureza:"Criminal",
            classe:"abcd",
            assunto:"safasdfa",
            dataAjuizamento:"01/03/2000",
            porteTribunal:"Médio",
            historicoFases:[
                {
                    nome:"F1",
                    situacao:"Concluído",
                    dataConclusao:"10/05/2011",
                    dataInicio:"01/03/2000"
                },
                {
                    nome:"F2",
                    situacao:"Em andamento",
                    dataConclusao:"",
                    dataInicio:"01/03/2000"
                },
                {
                    nome:"F3",
                    situacao:"Não Realizada",
                    dataConclusao:"",
                    dataInicio:""
                }
            ],
            dadosFases:[
                {
                    id:"1",
                    duracao:23,
                    duracaoPrevista:434,
                    status: "Concluído"
                },
                {
                    id:"2",
                    duracao:45,
                    duracaoPrevista:67,
                    status: "Em andamento"
                },
                {
                    id:"3",
                    duracao:-1,
                    duracaoPrevista:121,
                    status: "Não realizada"
                }
            ],
            alertas:[
                {
                    nome:"Probabilidade de Duração atípica (5% dos processos mais demorados de mesma natureza)",
                    valor:"78%"
                },
                {
                    nome:"Duração total estimada do processo",
                    valor:"432 dias"
                },
                {
                    nome:"Posição calculada da tribunal dentre os demais para a mesma classe baseado na duração média",
                    valor:"13 de 27"
                },
                {
                    nome:"Posição calculada da tribunal dentre os demais de mesmo porte para a mesma classe baseado na duração média",
                    valor:"4 de 13"
                },
                {
                    nome:"Posição calculada do orgão julgador dentre os demais do mesmo tribunal para a mesma classe baseado na duração média",
                    valor:"8 de 13"
                }
            ]
        }
    }

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        filter: false
      },
      duracao: {
        title: 'Duração',
        type: 'number',
        filter: false
      },
      duracaoPrevista: {
        title: 'Duração Prevista',
        type: 'number',
        filter: false
      },
      status: {
        title: 'Status',
        type: 'string',
        filter: false
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  private alive = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  date = new Date();
  date2 = new Date();

  fruits : string[] = [
    'Lemons',
    'Raspberries',
    'Strawberries',
    'Blackberries',
    'Kiwis',
    'Grapefruit',
    'Avocado',
    'Watermelon',
    'Cantaloupe',
    'Oranges',
    'Peaches',
  ];  
   
  positions: string[] = [
    NbGlobalPhysicalPosition.TOP_RIGHT,
    NbGlobalPhysicalPosition.TOP_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    NbGlobalLogicalPosition.TOP_END,
    NbGlobalLogicalPosition.TOP_START,
    NbGlobalLogicalPosition.BOTTOM_END,
    NbGlobalLogicalPosition.BOTTOM_START,
  ];

  results = [
    { name: 'Germany', value: 8940 },
    { name: 'USA', value: 5000 },
    { name: 'France', value: 7200 },
  ];
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  xAxisLabel = 'Country';
  yAxisLabel = 'Population';
  colorScheme: any;
  themeSubscription: any;

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
  };

  constructor(private themeService: NbThemeService,
              private solarService: SolarData,
              private service: SmartTableData) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });

    this.themeSubscription = this.themeService.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });

    const data = this.service.getData();
    this.source.load(this.predict.resultado.dadosFases);

  }

  ngOnDestroy(): void {
    this.alive = false;
    this.themeSubscription.unsubscribe();
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  getDadosTabelaPredictAlertas() {
        return this.predict.resultado.alertas;
  }

  getDadosTabelaPredictFases() {
    return this.predict.resultado.historicoFases;
}



}
