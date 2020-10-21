import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbThemeService, NbCalendarRange, NbDateService } from '@nebular/theme';
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
import { DatePipe } from '@angular/common';
import { Movimento } from 'app/models/movimento';
import { OrgaoJulgador } from 'app/models/orgao-julgador';
import { AssuntoRanking } from '../../models/assunto-ranking';

import { CloudData, CloudOptions } from 'angular-tag-cloud-module';

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

  assuntosRanking: AssuntoRanking[] = [];

  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value
    width: 1000,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value
    height: 400,
    overflow: false,
  };
 
  data: CloudData[] = [
    {text: 'Weight-8-link-color', weight: 8, link: 'https://google.com', color: '#ffaaee'},
    {text: 'Weight-10-link', weight: 10, link: 'https://google.com', tooltip: 'display a tooltip'},
    // ...
  ];

  rangeDatas: NbCalendarRange<Date>;

  movimentos: Movimento[] = [];
  orgaosJulgadores: OrgaoJulgador[] = [];
  orgaoJulgador: OrgaoJulgador;
  dataInicial = new Date();
  dataFinal = new Date();

  dashboardUrl: any;

  filtrosPm: FiltroPm[] = [];

  // dados aba predict
  historicoFases = [];
  dadosTabelaPredict : LocalDataSource = new LocalDataSource();
  alertas = [];
  exibirResultadoPredict= false;
  exibirResultadoNaoLocalizado= false;  
  // config tabela predict
  configTabelaPredict = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      nome: {
        title: 'Nome',
        type: 'string',
        filter: false
      },
      duracao: {
        title: 'Duração',
        type: 'string',
        filter: false
      },
      duracaoPrevista: {
        title: 'Duração Prevista',
        type: 'string',
        filter: false
      },
      status: {
        title: 'Status',
        type: 'string',
        filter: false
      },
    },
  };

  // config tabela fase
  dadosTabelaFase : LocalDataSource = new LocalDataSource();
  configTabelaFase = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      fase: {
        title: 'Fase',
        type: 'string',
        filter: false
      },
      natureza: {
        title: 'Natureza',
        type: 'string',
        filter: false
      },
    },
  };
  dadosMockTabelaFase = [
    {
      fase: 'F0 - NÃO CLASSIFICADO',
      natureza: 'CIVEL',
    },
    {
      fase: 'F1 - CONHECIMENTO',
      natureza: 'CRIMINAL',
    },
    {
      fase: 'F2 - RECURSO',
      natureza: 'CRIMINAL',
    },
    {
      fase: 'F3 - CUMPRIMENTO DE SENTENÇA',
      natureza: 'JUIZADO',
    },
  ];
  


  private alive = true;
  
  colorScheme: any;
  themeSubscription: any;
  
  constructor(private themeService: NbThemeService,
              private sanitizer: DomSanitizer,
              private datePipe: DatePipe,
              private inovacnjService: InovacnjService,
              private dateService: NbDateService<Date>) {

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
    this.inovacnjService.consultarTribunal(this.tipoJustica).subscribe(data => {
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
    this.inovacnjService.consultarMovimento().subscribe(data => { 
      this.movimentos = data;
    });
    this.inovacnjService.consultarOrgaoJulgador(this.tribunal).subscribe(data => { 
      this.orgaosJulgadores = data;
    });
    this.carregarAssuntosRanking();
    this.dadosTabelaFase.load(this.dadosMockTabelaFase);
  }

  private carregarAssuntosRanking() {
    this.inovacnjService.consultarAssuntoRanking(this.tipoJustica, this.tribunal, this.orgaoJulgador, this.natureza, this.classe).subscribe(data => {
      this.assuntosRanking = data;
      if (this.assuntosRanking != null && this.assuntosRanking.length > 0) {
        this.assuntosRanking.forEach((elem) => {
        })
      }
    });
  }

  tagClicked(tag) {
		console.log(tag);
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
      url += `justi%25C3%25A7a=${this.tipoJustica.codigo}&`
    }
    if (this.tribunal != null) {
      url += `tribunal=${this.tribunal.codigo}&`
    }
    if (this.orgaoJulgador != null) {
      url += `%25C3%25B3rg%25C3%25A3o_julgador=${this.orgaoJulgador.descricao}&`
    }
    if (this.natureza != null) {
      url += `natureza=${this.natureza.codigo}&`
    }
    if (this.classe != null) {
      url += `classe=${this.classe.descricao}&`
    }
    if (this.rangeDatas != null) {
      if (this.rangeDatas.start != null && this.rangeDatas.end != null) {
        const dateStart = this.datePipe.transform(this.rangeDatas.start,"yyyy-MM-dd");
        const dateEnd = this.datePipe.transform(this.rangeDatas.end,"yyyy-MM-dd");
        url += `datas=${dateStart}~${dateEnd}`;
      }
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
        this.exibirResultadoNaoLocalizado = false;
      } else {
        this.exibirResultadoPredict = false;
        this.exibirResultadoNaoLocalizado = true;
      }
    });
  }

  carregarTribunal(tipoJustica) {
    this.inovacnjService.consultarTribunal(tipoJustica).subscribe(data => {
      this.tribunais = data;
      this.tribunal = null;
    });
  }

  carregarOrgaoJulgador(tribunal) {
    console.log(tribunal.descricao);
    this.inovacnjService.consultarOrgaoJulgador(tribunal).subscribe(data => {
      this.orgaosJulgadores = data;
      this.orgaoJulgador = null;
    });
  }
  
  pesquisarAnalitcs() {
    this.setDashboardUrl();
  }
}
