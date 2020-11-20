import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbCalendarRange, NbDateService, NbDialogService, NbToastrService } from '@nebular/theme';
import { InovacnjService } from 'app/@core/services/inovacnj.service';
import { TipoJustica } from 'app/models/tipo-justica';
import { Tribunal } from 'app/models/tribunal';
import { LocalDataSource } from 'ng2-smart-table';
import { Natureza } from 'app/models/natureza';
import { Classe } from '../../models/classe';
import { arrayToTree } from 'performant-array-to-tree';
import { FiltroPm } from 'app/models/filtro-pm';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { Movimento } from 'app/models/movimento';
import { OrgaoJulgador } from 'app/models/orgao-julgador';
import { AssuntoRanking } from '../../models/assunto-ranking';

import * as svgPanZoom from 'svg-pan-zoom';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timer } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';
import { MetricaPm } from '../../models/filtro-pm';
import { Fase } from 'app/models/fase';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

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
  @ViewChild('fase') faseElement: ElementRef;

  loadingVisaoGeral = false;
  loadingProcess = false;
  loadingPredict = false;
  loadingConfig = false;

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
  tiposJusticaConfig: TipoJustica[] = [];
  tipoJusticaConfig: TipoJustica;
  tribunaisConfig: Tribunal[] = [];
  tribunalConfig: Tribunal;
  FaseSelecionada: Fase;
  codFase: number;
  descricaoFase: string;
  codTribunalFase: string;
  selectedOptions: Movimento[] = [];
  
  myControl = new FormControl();
  options: Movimento[] = [];
  filteredOptions: Observable<Movimento[]>;
  pesquisaAutoComplete: string;
  
  // config tabela fase
  dadosTabelaFase : LocalDataSource = new LocalDataSource();
  configTabelaFase = {
    rowClassFunction: (row) => { return 'ng2-custom-actions-inline' },
    hideSubHeader: true,
    noDataMessage: "Dados não carregados",
    actions: {
      custom: [
        {
          name: 'editar',
          title: '<i class="nb-edit"></i>'
        },
        {
          name: 'deletar',
          title: '<i class="nb-trash"></i>'
        }
      ],
      add: false,
      edit: false,
      delete: false,
      columnTitle: 'Ação'
    },
    columns: {
      codigo: {
        title: 'Código',
        type: 'number',
        filter: false,
      },
      descricao: {
        title: 'Descrição',
        type: 'string',
        filter: false,
      },
      cod_tribunal: {
        title: 'Tribunal',
        type: 'string',
        filter: false,
      },
      movimentosListaString: {
        title: 'Movimentos',
        type: 'html',
        filter: false,
        width: '800px'
      }
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
      this.tiposJusticaConfig = data;
    });
    this.inovacnjService.consultarTribunal(this.tipoJustica).subscribe(data => {
      this.tribunais = data;
      this.tribunaisProcess = data;
      this.tribunaisConfig = data;
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
    this.inovacnjService.consultarOrgaoJulgador(this.tribunal).subscribe(data => { 
      this.orgaosJulgadores = data;
      this.orgaosJulgadoresProcess = data;
    });
    //this.carregarAssuntosRanking();
            
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

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        //debounceTime(200),
        map(value => typeof value === 'string' ? value : value.descricao),
        map(descricao => descricao ? this._filter(descricao) : this.options.slice())
      );

  }

  displayFn(mov: Movimento): string {
    return mov && mov.descricao ? mov.descricao : '';
  }

  private _filter(descricao: string): Movimento[] {
    const filterValue = descricao.toLowerCase();

    return this.options.filter(option => option.descricao.toLowerCase().indexOf(filterValue) === 0);
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
    this.loadingProcess = true;
    console.log('adicionarModeloPm');
    if (this.tribunalProcess != null) {
      if (this.naturezaProcess != null) {
        const filtro = new FiltroPm(this.tipoJusticaProcess, this.tribunalProcess, this.orgaoJulgadorProcess, 
          this.naturezaProcess, this.classeProcess);
        this.downloadModeloPmSvgContent(filtro).subscribe(response => {
          this.filtrosPm.push(filtro);
          var idx = this.filtrosPm.indexOf(filtro);
          timer(100).subscribe(val => {
            this.initFiltroModeloSvg(filtro, idx);
            filtro.svgObject.resize();
            filtro.svgObject.fit();
            this.loadingProcess = false;
          });
        }, error => {
          console.error(error);
          if (error.status == 400) {
            this.toastrService.warning('Por favor, selecione os filtros para geração do modelo.', `Selecione os filtros!`);
          } else if (error.status == 404) {
            this.toastrService.warning('Não existem dados para geração do modelo.', `Sem dados!`);
          } else {
            this.toastrService.danger('Ocorreu um erro inesperado ao consultar dados.', `Erro inesperado!`); 
          }
          this.loadingProcess = false;
        });
      }
    } else {
      this.loadingProcess = false;
      this.toastrService.warning('Por favor, selecione os filtros para geração do modelo.', `Selecione os filtros!`);
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
    this.loadingPredict = true;
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
      this.loadingPredict = false;
    });
  }

  carregarTribunal(tipoJustica) {
    this.loadingVisaoGeral = true;
    this.inovacnjService.consultarTribunal(tipoJustica).subscribe(data => {
      this.tribunais = data;
      this.tribunal = null;
      this.loadingVisaoGeral = false;
    });
  }

  carregarOrgaoJulgador(tribunal) {
    this.loadingVisaoGeral = true;
    this.inovacnjService.consultarOrgaoJulgador(tribunal).subscribe(data => {
      this.orgaosJulgadores = data;
      this.orgaoJulgador = null;
      this.loadingVisaoGeral = false;
    });
  }

  //aba process
  carregarTribunalProcess(tipoJustica) {
    this.loadingProcess = true;
    this.inovacnjService.consultarTribunal(tipoJustica).subscribe(data => {
      this.tribunaisProcess = data;
      this.tribunalProcess = null;
      this.loadingProcess = false;
    });
  }

  carregarOrgaoJulgadorProcess(tribunal) {
    this.loadingProcess = true;
    this.inovacnjService.consultarOrgaoJulgador(tribunal).subscribe(data => {
      this.orgaosJulgadoresProcess = data;
      this.orgaoJulgadorProcess = null;
      this.loadingProcess = false;
    });
  }

  //aba config
  carregarTribunalConfig(tipoJustica) {
    this.loadingConfig = true;
    this.inovacnjService.consultarTribunal(tipoJustica).subscribe(data => {
      this.tribunaisConfig = data;
      this.tribunalConfig = null;
      this.loadingConfig = false;
    });
  }

  pesquisarAnalitcs() {
    this.setDashboardUrl();
  }

  onSaveConfirm(event): void {
    if (window.confirm('Deseja salvar?')) {
      this.loadingConfig = true;
      let novaFase = new Fase();
      novaFase.cod_tribunal = this.tribunalConfig.codigo;
      novaFase.tribunal = this.tribunalConfig;
      novaFase.descricao = this.descricaoFase;
      //novaFase.movimentos = this.selectedOptions;
      novaFase.movimentos = this.movimentos;
      
      //alterar
      if (this.codFase > 0) {
        novaFase.codigo = this.codFase;
        this.inovacnjService.atualizarFase(novaFase).subscribe(data => {
          this.dadosTabelaFase.remove(this.FaseSelecionada);
          this.dadosTabelaFase.add(data);
          this.dadosTabelaFase.refresh();
          
          this.limparCamposFase();
          this.loadingConfig = false;
          this.toastrService.success('Fase Alterada com Sucesso!', `Sucesso!`); 
          //event.confirm.resolve();
        });
      //salvar
      } else {
        this.inovacnjService.salvarFase(novaFase).subscribe(data => {
          this.dadosTabelaFase.add(data);
          this.dadosTabelaFase.refresh();
          
          this.limparCamposFase();
          this.loadingConfig = false;
          this.toastrService.success('Fase Cadastrada com Sucesso!', `Sucesso!`);
          //event.confirm.resolve();
        });
      }
      
    } else {
      this.limparCamposFase();
      //event.confirm.reject();
    }
  }
  
  limparCamposFase() {
    this.tipoJusticaConfig = null;
    this.tribunalConfig = null;
    this.codFase = 0;
    this.codTribunalFase = "";
    this.descricaoFase = "";
    this.selectedOptions = [];
    this.movimentos = [];
    this.pesquisaAutoComplete = "";
    this.FaseSelecionada = null;
  }

  //editar fase
  onEditConfirm(event): void {
    if (window.confirm('Deseja editar?')) {
      this.FaseSelecionada = event.data;

      this.codFase = event.data.codigo;
      this.descricaoFase = event.data.descricao;
      this.movimentos = event.data.movimentos;
      this.tipoJusticaConfig = event.data.tribunal.tipo;
      this.tribunalConfig = event.data.tribunal;
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.faseElement.nativeElement.focus();
      },0);  
      //event.confirm.resolve();
    } else {
      //event.confirm.reject();
    }
  }

  //excluir fase
  onDeleteConfirm(event): void {
    if (window.confirm('Deseja excluir?')) {
      this.inovacnjService.deletarFase(event.data).subscribe(data => {
        this.dadosTabelaFase.remove(event.data);
        this.limparCamposFase();
        this.toastrService.success('Fase Removida com Sucesso!', `Sucesso!`);
        //event.confirm.resolve();
      });
    } else {
      //event.confirm.reject();
    }
  }

  //evento click nos icones da tabela de fase
  onClickTable(event) {
    if (event.action == 'deletar'){
      this.onDeleteConfirm(event);
    } else if (event.action == 'editar'){
      this.onEditConfirm(event);
    } else {
      alert(`Custom event '${event.action}' fired on row №: ${event.data.codigo}`)
    }
  }

  //evento de selecionar movimento no autocomplete
  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    let val = event.option.value
    let index = this.movimentos.indexOf(val);
    if(index < 0) {
      this.movimentos.push(event.option.value);
    }
  }
  
  onRemoverMovimentoLista(event, mov: Movimento): void {
    if (window.confirm('Deseja excluir?')) {
      let indice = this.movimentos.indexOf(mov);
      if  (indice > -1) {
        this.movimentos.splice(indice, 1);
      }
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  carregarAba(event) : void {
    this.loadingConfig = true;
    if (event.tabTitle === "Configurações") {
      if (this.options.length > 0) {
        this.loadingConfig = false;
      } else {
        this.inovacnjService.consultarMovimento().subscribe(data => { 
          this.options= data;
        });
        this.inovacnjService.consultarFases().subscribe(data => { 
          this.dadosTabelaFase.load(data);
          this.loadingConfig = false;  
        });
      }
    }
  }
    
}
