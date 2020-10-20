import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbThemeService } from '@nebular/theme';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { SmartTableData } from 'app/@core/data/smart-table';
import { InovacnjService } from 'app/@core/services/inovacnj.service';
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

export class DashboardComponent implements OnDestroy, OnInit {

  tiposJustica: any[] = [];
  tipoJustica: any;
  tribunais: any[] = [];
  tribunal: any;
  naturezas: any[] = [];
  natureza: any;
  classes: any[] = [];
  classe: any;
  dataInicial = new Date();
  dataFinal = new Date();

  // config tabela Analitcs
  dadosTabelaAnalitcs : LocalDataSource = new LocalDataSource();
  configTabelaAnalitcs = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      natureza: {
        title: 'Natureza',
        type: 'string',
        filter: false
      },
      classe: {
        title: 'Classe',
        type: 'string',
        filter: false
      },
      duracaoMedia: {
        title: 'Duração Média',
        type: 'string',
        filter: false
      },
      faseMaisDemorada: {
        title: 'Fase Mais Demorada',
        type: 'string',
        filter: false
      },
      assuntoMaisDemorado: {
        title: 'Assunto Mais Demorado',
        type: 'string',
        filter: false
      },
    },
  };
  
  // dados aba predict
  historicoFases = {};
  dadosTabelaPredict : LocalDataSource = new LocalDataSource();
  alertas = {};
    
  // config tabela predict
  configTabelaPredict = {
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


  private alive = true;
  
  //grafico exemplo
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
  //remover quando colocar o meta base

  constructor(private themeService: NbThemeService,
              private inovacnjService: InovacnjService) {

    this.themeSubscription = this.themeService.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });

  }

  ngOnInit(): void {
    this.inovacnjService.consultarTipoJustica().subscribe(data => {
      this.tiposJustica = data;
    });
    this.inovacnjService.consultarTribunal().subscribe(data => {
      this.tribunais = data;
    });
    this.inovacnjService.consultarNatureza().subscribe(data => { 
      this.naturezas = data;
    });
    this.inovacnjService.consultarClasse().subscribe(data => {
      this.classes = data;
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.themeSubscription.unsubscribe();
  }

  pesquisarNpu(npu) {
    if (this.inovacnjService.getExisteNpu(npu)) {
      this.dadosTabelaPredict.load(this.inovacnjService.getDadosFases());
      this.alertas = this.inovacnjService.getAlertas();
      this.historicoFases = this.inovacnjService.getHistoricoFases();
    } 
  }
  
  pesquisarAnalitcs() {
    console.log(this.dataInicial);
    console.log(this.dataFinal);
    console.log(this.tipoJustica);
    console.log(this.tribunal); 
    console.log(this.natureza);
    console.log(this.classe);

    this.dadosTabelaAnalitcs.load(this.inovacnjService.pesquisarAnalitcs(
      this.dataInicial, this.dataFinal, this.tipoJustica, this.tribunal, this.natureza, this.classe));
  }
}
