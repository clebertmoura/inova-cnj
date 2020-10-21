import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbThemeService } from '@nebular/theme';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { SmartTableData } from 'app/@core/data/smart-table';
import { InovacnjService } from 'app/@core/services/inovacnj.service';
import { TipoJustica } from 'app/models/tipo-justica';
import { Tribunal } from 'app/models/tribunal';
import { LocalDataSource } from 'ng2-smart-table';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';
import { Natureza } from 'app/models/natureza';
import { Classe } from '../../models/classe';
import { arrayToTree } from 'performant-array-to-tree';
import { FiltroPm } from 'app/models/filtro-pm';
import { ProcessoPredict } from 'app/models/processo-predict';
import { DomSanitizer } from '@angular/platform-browser';

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

  tiposJustica: TipoJustica[] = [];
  tipoJustica: TipoJustica;
  tribunais: Tribunal[] = [];
  tribunal: Tribunal;
  naturezas: Natureza[] = [];
  natureza: Natureza;
  naturezaFase: Natureza;
  classes: Classe[] = [];
  classe: Classe;
  dataInicial = new Date();
  dataFinal = new Date();

  dashboardUrl: any;

  filtrosPm: FiltroPm[] = [];

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
  exibirResultadoPredict= false;
    
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
              private sanitizer: DomSanitizer,
              private inovacnjService: InovacnjService) {

    this.themeSubscription = this.themeService.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });
    this.setDashboardUrl();
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
      let arvoreClasses = this.converterParaArvore(this.classes);
      console.log(arvoreClasses);
    });
  }

  converterParaArvore(data: Classe[]) {
    return arrayToTree(data, {id: 'codigo', parentId: 'codigoPai', childrenField: 'filhos'});
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.themeSubscription.unsubscribe();
  }

  adicionarModeloPm(): void {
    console.log('adicionarModeloPm');
    if (this.tribunal != null) {
      if (this.natureza != null) {
        const filtroPm = new FiltroPm(this.tribunal, this.natureza, this.classe);
        this.filtrosPm.push(filtroPm);
      }
    }
  }

  removerModeloPm(filtro: FiltroPm): void {
    console.log('removerModeloPm');
    const idx = this.filtrosPm.indexOf(filtro);
    this.filtrosPm.splice(idx, 1);
  }

  getUrlModeloPm(filtro: FiltroPm): string {
    return this.inovacnjService.getUrlModeloPm(filtro);
  }

  /**
   * Retorna uma coleção de Natureza
   */
  setDashboardUrl(): any {
    let url = 'http://161.97.71.108:3000/public/dashboard/4e8d4bbf-eeea-4a85-afbf-b22d8cf3b80e?';
    if (this.tipoJustica != null) {
      url += `tipo_justica=${this.tipoJustica.codigo}&`
    }
    if (this.tribunal != null) {
      url += `tribunal=${this.tribunal.codigo}&`
    }
    if (this.natureza != null) {
      url += `natureza=${this.natureza.codigo}&`
    }
    if (this.classe != null) {
      url += `classe=${this.classe.descricao}&`
    }
    console.log(url);
    this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  pesquisarNpu(npu) {
    this.inovacnjService.consultarNpuPredict(npu).subscribe(data => {
      console.log(data);
      if (data !== null) {
        this.dadosTabelaPredict.load(data.dadosFases);
        this.alertas = data.alertas;
        this.historicoFases = data.historicoFases;
        this.exibirResultadoPredict = true;
      } else {
        this.exibirResultadoPredict = false;
      }
    });

  }
  
  pesquisarAnalitcs() {
    console.log(this.dataInicial);
    console.log(this.dataFinal);
    console.log(this.tipoJustica);
    console.log(this.tribunal); 
    console.log(this.natureza);
    console.log(this.classe);

    this.setDashboardUrl();

    this.dadosTabelaAnalitcs.load(this.inovacnjService.pesquisarAnalitcs(
      this.dataInicial, this.dataFinal, this.tipoJustica, this.tribunal, this.natureza, this.classe));
  }
}
