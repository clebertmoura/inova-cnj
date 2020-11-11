import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbThemeService, NbCalendarRange, NbDateService, NbDialogService, NbToastrService } from '@nebular/theme';
import { SmartTableData } from 'app/@core/data/smart-table';
import { InovacnjService } from 'app/@core/services/inovacnj.service';
import { TipoJustica } from 'app/models/tipo-justica';
import { Tribunal } from 'app/models/tribunal';
import { LocalDataSource } from 'ng2-smart-table';
import { takeWhile, delay } from 'rxjs/operators';
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

import * as svgPanZoom from 'svg-pan-zoom';

import { TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timer } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';
import { MetricaPm } from '../../models/filtro-pm';
import { Fase } from 'app/models/fase';

declare var jQuery: any;

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

  //aba Process
  tiposJusticaProcess: TipoJustica[] = [];
  tipoJusticaProcess: TipoJustica;
  tribunaisProcess: Tribunal[] = [];
  tribunalProcess: Tribunal;
  orgaosJulgadoresProcess: OrgaoJulgador[] = [];
  orgaoJulgadorProcess: OrgaoJulgador;
  naturezasProcess: Natureza[] = [];
  naturezaProcess: Natureza;
  classesProcess: Classe[] = [];
  classeProcess: Classe;

  metricasPm: MetricaPm[] = [
    MetricaPm.Frequency, MetricaPm.Performance
  ];

  assuntosRanking: AssuntoRanking[] = [];

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

  // aba configuracao
  idFase: number;
  nomeFase: string;
  descricaoFase: string;

  // config tabela fase
  dadosTabelaFase : LocalDataSource = new LocalDataSource();
  configTabelaFase = {
    actions: {
      add: false,
      edit: false,
      columnTitle: 'Ação',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      codigo: {
        title: 'Código',
        type: 'number',
        filter: false
      },
      nome: {
        title: 'Fase',
        type: 'string',
        filter: false
      },
      descricao: {
        title: 'Descrição',
        type: 'string',
        filter: false
      },
    },
  };
    
  dadosProcessoOrgaoJulgador: String;
  dadosProcessoSiglaTribunal: String;
  dadosProcessoClasse: String;
  dadosProcessoNatureza: String;
  dadosProcessoAssunto: String;

  private alive = true;
  
  colorScheme: any;
  themeSubscription: any;
  
  constructor(private themeService: NbThemeService,
              private sanitizer: DomSanitizer,
              private datePipe: DatePipe,
              private inovacnjService: InovacnjService,
              private dateService: NbDateService<Date>,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService,
              protected http: HttpClient) {

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
      this.tiposJusticaProcess = data;
    });
    this.inovacnjService.consultarTribunal(this.tipoJustica).subscribe(data => {
      this.tribunais = data;
      this.tribunaisProcess = data;
    });
    this.inovacnjService.consultarNatureza().subscribe(data => { 
      this.naturezas = data;
      this.naturezasProcess = data;
    });
    this.inovacnjService.consultarClasse().subscribe(data => {
      this.classes = data;
      this.classesProcess = data;
      let arvoreClasses = this.converterParaArvore(this.classes);
      console.log(arvoreClasses);
    });
    this.inovacnjService.consultarMovimento().subscribe(data => { 
      this.movimentos = data;
    });
    this.inovacnjService.consultarOrgaoJulgador(this.tribunal).subscribe(data => { 
      this.orgaosJulgadores = data;
      this.orgaosJulgadoresProcess = data;
    });
    this.carregarAssuntosRanking();
    this.inovacnjService.consultarFases().subscribe(data => { 
      this.dadosTabelaFase.load(data);  
    });
    

    jQuery(document).ready(function() {
      var words = [
        {text: "Lorem", weight: 13},
        {text: "Ipsum", weight: 10.5},
        {text: "Dolor", weight: 9.4},
        {text: "Sit", weight: 8},
        {text: "Amet", weight: 6.2},
        {text: "Consectetur", weight: 5},
        {text: "Adipiscing", weight: 5},
        /* ... */
      ];
      // jQuery('#nuvemAssuntos').jQCloud(words, {
      //   width: 300,
      //   height: 250
      // });
    });

  }

  limparModeloProcesso() {
    this.filtrosPm.length = 0;
    this.tipoJusticaProcess = null;
    this.orgaoJulgadorProcess = null;
    this.tribunalProcess = null;
    this.naturezaProcess = null;
    this.classeProcess = null;
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
    if (this.tribunalProcess != null) {
      if (this.naturezaProcess != null) {
        const filtro = new FiltroPm(this.tribunalProcess, this.orgaoJulgadorProcess, 
          this.naturezaProcess, this.classeProcess);
        this.downloadModeloPmSvgContent(filtro).subscribe(response => {
          this.filtrosPm.push(filtro);
          var idx = this.filtrosPm.indexOf(filtro);
          timer(100).subscribe(val => {
            this.initFiltroModeloSvg(filtro, idx);
            filtro.svgObject.resize();
            filtro.svgObject.fit();
          });
        }, error => {
          console.error(error);
          this.toastrService.warning('Não existem dados para geração do modelo.', `Sem dados!`);
        });
      }
    }
  }

  downloadModeloPmSvgContent(filtro: FiltroPm) {
    const headers = new HttpHeaders();
    headers.set('Accept', 'image/svg+xml');
    var obs = this.http.get(filtro.url, {headers: headers, responseType: 'text'});
    obs.subscribe(response => {
      if (response != null) {
        filtro.svgContent = this.sanitizer.bypassSecurityTrustHtml(response);
      }
    });
    return obs;
  }

  onChangeSensibilidade(event: MatSliderChange, filtro: FiltroPm, idx: number) {
    console.log('onChangeSensibilidade', event);
    filtro.updateUrl();
    this.downloadModeloPmSvgContent(filtro).subscribe(val => {
      filtro.svgObject = null;
      this.initFiltroModeloSvg(filtro, idx);
      timer(50).subscribe(val2 => {
        filtro.svgObject.reset();
      });
    });
  }

  onChangeMetrica(event: MatSliderChange, filtro: FiltroPm, idx: number) {
    console.log('onChangeMetrica', event);
    filtro.updateUrl();
    this.downloadModeloPmSvgContent(filtro).subscribe(val => {
      filtro.svgObject = null;
      this.initFiltroModeloSvg(filtro, idx);
      timer(50).subscribe(val2 => {
        filtro.svgObject.reset();
      });
    });
  }

  removerModeloPm(filtro: FiltroPm): void {
    console.log('removerModeloPm');
    const idx = this.filtrosPm.indexOf(filtro);
    this.filtrosPm.splice(idx, 1);
  }

  maximizarModeloPm(filtro: FiltroPm, idx: number) {
    filtro.maximized = !filtro.maximized;
    this.initFiltroModeloSvg(filtro, idx);
    timer(100).subscribe(val => {
      filtro.svgObject.resize();
      filtro.svgObject.center();
    });
  }

  initFiltroModeloSvg(filtro: FiltroPm, idx: number) {
    if (filtro.svgObject == null) {
      var svgElement = jQuery(`#divModeloPm_${idx} svg`)[0];
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');
      filtro.svgObject = svgPanZoom(svgElement, {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
      });
    }
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
        this.dadosProcessoSiglaTribunal = data.siglaTribunal;
        this.dadosProcessoOrgaoJulgador = data.orgaoJulgador;
        this.dadosProcessoClasse = data.classe;
        this.dadosProcessoNatureza = data.natureza;
        this.dadosProcessoAssunto = data.assunto;
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
    this.inovacnjService.consultarOrgaoJulgador(tribunal).subscribe(data => {
      this.orgaosJulgadores = data;
      this.orgaoJulgador = null;
    });
  }

  //aba process
  carregarTribunalProcess(tipoJustica) {
    this.inovacnjService.consultarTribunal(tipoJustica).subscribe(data => {
      this.tribunaisProcess = data;
      this.tribunalProcess = null;
    });
  }

  carregarOrgaoJulgadorProcess(tribunal) {
    this.inovacnjService.consultarOrgaoJulgador(tribunal).subscribe(data => {
      this.orgaosJulgadoresProcess = data;
      this.orgaoJulgadorProcess = null;
    });
  }

  pesquisarAnalitcs() {
    this.setDashboardUrl();
  }

  onSaveConfirm(event): void {
    if (window.confirm('Deseja salvar?')) {
      let novaFase = new Fase();
      novaFase.nome = this.nomeFase;
      novaFase.descricao = this.descricaoFase;
      
      this.inovacnjService.salvarFase(novaFase).subscribe(data => {
        this.nomeFase = "";
        this.descricaoFase = "";

        this.inovacnjService.consultarFases().subscribe(data => { 
          this.dadosTabelaFase.load(data);  
        });
        
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }
  

  onDeleteConfirm(event): void {
    if (window.confirm('Deseja excluir?')) {
      this.inovacnjService.deletarFase(event.data).subscribe(data => {
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }
    
}
