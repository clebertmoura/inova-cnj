import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbCalendarRange, NbDateService, NbDialogService, NbToastrService, NbFlipCardComponent } from '@nebular/theme';
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
import { of, timer, forkJoin } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';
import { MetricaPm } from '../../models/filtro-pm';
import { Fase } from 'app/models/fase';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TipoOrgao } from 'app/models/tipo-orgaoJulgador';
import { Filtro, FiltroComponent } from './filtro/filtro.component';

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
  @ViewChild('visaoGeralFiltro') visaoGeralFiltro: FiltroComponent;
  @ViewChild('fluxoFiltro') fluxoFiltro: FiltroComponent;

  // configurações grafico de barras
  view: any[] = [450, 250];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Intervalo em Dias';
  showYAxisLabel = true;
  yAxisLabel = 'Prob. de Término(%)';
  colorSchemeGrafico: any;

  loadingPredict = false;
  loadingConfig = false;

  filtroVisaoGeral : Filtro = new Filtro();
  filtroProcess : Filtro = new Filtro();

  dashboardUrl: any;

  //aba Process
  metricasPm: MetricaPm[] = [
    MetricaPm.Frequency, MetricaPm.Performance
  ];
  filtrosPm: FiltroPm[] = [];
  // config tabela Estatistica
  configTabelaEstatistica = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    hideHeader: true,
    hideSubHeader: true,
    noDataMessage: "Carregando as estatísticas do modelo...",
    columns: {
      campo: {
        title: 'Campo',
        type: 'string',
        filter: false
      },
      valor: {
        title: 'Valor',
        type: 'string',
        filter: false
      },
    },
  };

  // config tabela Estatistica
  configTabelaOrgaoJulgadorModelFit = {
    actions: {
      columnTitle: 'Ver o fluxo',
      add: false,
      edit: false,
      delete: false,
      custom: [
        { name: 'adcionarModelo', title: '<div class="ph-2"><i class="fa fa-eye"></i></div>'}
      ],
      position: 'right'
    },
    hideHeader: false,
    hideSubHeader: true,
    noDataMessage: "Sem dados...",
    columns: {
      descricao: {
        title: 'Órgão Julagor',
        type: 'string',
        filter: true
      },
      traceFitness: {
        title: '% de conformidade ao modelo',
        type: 'float',
        filter: false
      },
    },
  };

  assuntosRanking: AssuntoRanking[] = [];

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
    noDataMessage: "Carregando Dados",
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
  naturezaFase: Natureza;
  codTribunalFase: string;
  movimentos: Movimento[] = [];
  selectedOptions: Movimento[] = [];
  disabledTribunalConfig = true;
  
  myControl = new FormControl();
  options: Movimento[] = [];
  filteredOptions: Observable<Movimento[]>;
  pesquisaAutoComplete: string;
  
  // config tabela fase
  dadosTabelaFase : LocalDataSource = new LocalDataSource();
  configTabelaFase = {
    rowClassFunction: (row) => { return 'ng2-custom-actions-inline' },
    hideSubHeader: true,
    noDataMessage: "Carregando Dados",
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
      this.colorSchemeGrafico = {
        domain: [colors.infoLight],
      };
    });
    this.setDashboardUrl();
  }

  ngOnInit(): void {
    this.inovacnjService.consultarTipoJustica().subscribe(data => {
      this.tiposJusticaConfig = data;
    });
            
    jQuery(document).ready(function() {
      
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        //debounceTime(200),
        map(value => typeof value === 'string' ? value : value.descricao),
        map(descricao => descricao ? this._filter(descricao) : this.options.slice())
      );
  }

  onCustomAction(event) {
    console.log('onCustomAction', event);
    switch (event.action) {
      case 'adcionarModelo':
        const orgaoJulgador = new OrgaoJulgador();
        orgaoJulgador.codigo = event.data.codigo;
        orgaoJulgador.descricao = event.data.descricao;
        orgaoJulgador.codigoTribunal = event.data.codigoTribunal;

        const filtro = new FiltroPm(this.filtroProcess.tipoJustica, this.filtroProcess.tribunal, 
          orgaoJulgador, this.filtroProcess.atuacaoOrgaoJulgador, this.filtroProcess.natureza, 
          this.filtroProcess.classe, this.filtroProcess.cluster, this.filtroProcess.baixado);
        
        this.fluxoFiltro.setLoading(true);
        this.downloadModeloPmSvgContent(filtro).subscribe(response => {
          this.fluxoFiltro.setLoading(false);
          this.filtrosPm.push(filtro);
          var idx = this.filtrosPm.indexOf(filtro);
          this.inovacnjService.consultarEstatisticaModeloPm(filtro).subscribe(dadosEstatistica => {
            filtro.dadosTabelaEstatistica.load(dadosEstatistica.estatistica);
            filtro.dadosGrafico = dadosEstatistica.grafico;
          });
          timer(100).subscribe(val => {
            this.initFiltroModeloSvg(filtro, idx);
            filtro.svgObject.resize();
            filtro.svgObject.fit();
            this.fluxoFiltro.setLoading(false);
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
          this.fluxoFiltro.setLoading(false);
        });
        break;
    }
  }

  onAplicarFiltro(event) {
    console.log('onAplicarFiltro', event);
    this.filtroVisaoGeral = event;
    this.setDashboardUrl();
  }

  onLimparFiltro(event) {
    console.log('onLimparFiltro', event);
  }

  displayFn(mov: Movimento): string {
    return mov && mov.descricao ? mov.descricao : '';
  }

  private _filter(descricao: string): Movimento[] {
    const filterValue = descricao.toLowerCase();
    return this.options.filter(option => option.descricao.toLowerCase().indexOf(filterValue) === 0);
  }

  onLimparModeloProcesso(event) {
    console.log('onLimparModeloProcesso', event);
    this.filtrosPm.length = 0;
  }

  // private carregarAssuntosRanking() {
  //   this.inovacnjService.consultarAssuntoRanking(this.tipoJustica, this.tribunal, this.orgaoJulgador, this.natureza, this.classe).subscribe(data => {
  //     this.assuntosRanking = data;
  //     if (this.assuntosRanking != null && this.assuntosRanking.length > 0) {
  //       this.assuntosRanking.forEach((elem) => {
  //       })
  //     }
  //   });
  // }

  toggleCard(event: any, $cardComponent: NbFlipCardComponent) {
    $cardComponent.toggle();
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

  onAdicionarModeloProcesso(event) {
    console.log('onAdicionarModeloProcesso', event);
    this.filtroProcess = event;
    //if (this.filtroProcess.tribunal != null) {
      if (this.filtroProcess.atuacaoOrgaoJulgador != null) {
        const filtro = new FiltroPm(this.filtroProcess.tipoJustica, this.filtroProcess.tribunal, this.filtroProcess.orgaoJulgador, 
          this.filtroProcess.atuacaoOrgaoJulgador, this.filtroProcess.natureza, this.filtroProcess.classe, this.filtroProcess.cluster, 
          this.filtroProcess.baixado);
        
        this.fluxoFiltro.setLoading(true);
        this.downloadModeloPmSvgContent(filtro).subscribe(response => {
          this.fluxoFiltro.setLoading(false);
          this.filtrosPm.push(filtro);
          var idx = this.filtrosPm.indexOf(filtro);
          this.inovacnjService.consultarEstatisticaModeloPm(filtro).subscribe(dadosEstatistica => {
            filtro.dadosTabelaEstatistica.load(dadosEstatistica.estatistica);
            filtro.dadosGrafico = dadosEstatistica.grafico;
          });
          this.onClickVerficarConformidade(filtro);
          timer(100).subscribe(val => {
            this.initFiltroModeloSvg(filtro, idx);
            filtro.svgObject.resize();
            filtro.svgObject.fit();
            this.fluxoFiltro.setLoading(false);
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
          this.fluxoFiltro.setLoading(false);
        });
      } else {
        this.toastrService.warning('Por favor, selecione o ramo de atuação para geração do modelo.', `Selecione os filtros!`);
      }
    //} else {
    //  this.toastrService.warning('Por favor, selecione um tribunal para geração do modelo.', `Selecione os filtros!`);
    //}
  }

  onClickVerficarConformidade(filtro: FiltroPm) {
    this.inovacnjService.consultarOrgaosJulgadoresModelFit(filtro).subscribe(dadosOrgaosJulgadoresModelFit => {
      console.log(dadosOrgaosJulgadoresModelFit);
      filtro.dadosTabelaOrgaosJulgadoresModelFit.load(dadosOrgaosJulgadoresModelFit);
    });
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
    this.fluxoFiltro.setLoading(true);
    filtro.updateUrl();
    this.downloadModeloPmSvgContent(filtro).subscribe(val => {
      filtro.svgObject = null;
      this.inovacnjService.consultarEstatisticaModeloPm(filtro).subscribe(data => { 
        filtro.dadosTabelaEstatistica.load(data);
        this.initFiltroModeloSvg(filtro, idx);
      });
      this.initFiltroModeloSvg(filtro, idx);
      timer(50).subscribe(val2 => {
        filtro.svgObject.reset();
        this.fluxoFiltro.setLoading(false);
      });
    });
  }

  onChangeMetrica(event: MatSliderChange, filtro: FiltroPm, idx: number) {
    console.log('onChangeMetrica', event);
    this.fluxoFiltro.setLoading(true);
    filtro.updateUrl();
    this.downloadModeloPmSvgContent(filtro).subscribe(val => {
      filtro.svgObject = null;
      this.initFiltroModeloSvg(filtro, idx);
      timer(50).subscribe(val2 => {
        filtro.svgObject.reset();
        this.fluxoFiltro.setLoading(false);
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

      var smartTableElement = jQuery(`#smartTableModeloPm_${idx}`)[0];
      if (smartTableElement != null && filtro.dadosTabelaEstatistica !== null) {
        smartTableElement.setAttribute('source', filtro.dadosTabelaEstatistica);
      }

      var graficoElement = jQuery(`#graficoModeloPm_${idx}`)[0];
      if (graficoElement != null && filtro.dadosGrafico !== null) {
        graficoElement.setAttribute('results', filtro.dadosGrafico);
      }
    }

  }

  /**
   * Configura a URL do Dashboard
   */
  setDashboardUrl(): any {
    let url = 'http://161.97.71.108:3000/public/dashboard/';
    if (this.filtroVisaoGeral.tipoJustica != null) {
      switch(this.filtroVisaoGeral.tipoJustica.codigo) {
        case 'Eleitoral': 
          url += `3fc379e7-26ac-4138-befe-5bdbc9cf030b`;
        break;
        case 'Estadual': 
          url += `89613a9e-31a9-42cd-b4d0-4c99c0065df7`;
        break;
        case 'Federal': 
          url += `e8f040d4-f400-40fa-9cd0-e9a3b9f16220`;
        break;
        case 'Militar': 
          url += `6b8ba49e-cbaa-4efd-867c-6421cfd3dc29`;
        break;
        case 'Trabalho': 
          url += `21e8ce33-d0b5-4e43-b01a-658a9d4234b8`;
        break;
        default:
          url += `32e1b3c2-6a81-4c79-82a2-048bb708ae44`;
        break;
      }
      url += `?justi%25C3%25A7a=${this.filtroVisaoGeral.tipoJustica.codigo}`
    } else {
      url += `?`
    }
    if (this.filtroVisaoGeral.tribunal != null) {
      url += `&tribunal=${this.filtroVisaoGeral.tribunal.codigo}`
    }
    if (this.filtroVisaoGeral.orgaoJulgador != null) {
      url += `&%25C3%25B3rg%25C3%25A3o_julgador=${this.filtroVisaoGeral.orgaoJulgador.descricao}`
    }
    if (this.filtroVisaoGeral.natureza != null) {
      url += `&natureza=${this.filtroVisaoGeral.natureza.descricao}`
    }
    if (this.filtroVisaoGeral.classe != null) {
      url += `&classe=${this.filtroVisaoGeral.classe.descricao}`
    }
    if (this.filtroVisaoGeral.rangeDatas != null) {
      if (this.filtroVisaoGeral.rangeDatas.start != null && this.filtroVisaoGeral.rangeDatas.end != null) {
        const dateStart = this.datePipe.transform(this.filtroVisaoGeral.rangeDatas.start,"yyyy-MM-dd");
        const dateEnd = this.datePipe.transform(this.filtroVisaoGeral.rangeDatas.end,"yyyy-MM-dd");
        url += `&datas=${dateStart}~${dateEnd}`;
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

  //aba config
  carregarTribunalConfig(tipoJustica , edicao?:boolean, tribunal?:Tribunal) {
    this.loadingConfig = true;
    this.inovacnjService.consultarTribunal(tipoJustica).subscribe(data => {
      this.tribunaisConfig = data
      if (edicao != null && edicao == true){
        const trib = this.tribunaisConfig.filter((tj) => tj.codigo == tribunal.codigo);
        if (trib != null && trib.length == 1) {
          this.tribunalConfig = trib[0];
        }
      } else {
        this.tribunalConfig = null;
      }
      this.disabledTribunalConfig = false;
      this.loadingConfig = false;
    });
  }

  onSaveConfirm(event): void {
    if (window.confirm('Deseja salvar?')) {
      this.loadingConfig = true;
      if (this.descricaoFase != null && this.tribunalConfig != null) {
        let novaFase = new Fase();
        novaFase.cod_tribunal = this.tribunalConfig.codigo;
        novaFase.tribunal = this.tribunalConfig;
        novaFase.descricao = this.descricaoFase;
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
          });
        //salvar
        } else {
          this.inovacnjService.salvarFase(novaFase).subscribe(data => {
            this.dadosTabelaFase.add(data);
            this.dadosTabelaFase.refresh();
            this.limparCamposFase();
            this.loadingConfig = false;
            this.toastrService.success('Fase Cadastrada com Sucesso!', `Sucesso!`);
          });
        }
      } else {
        this.loadingConfig = false;
        this.toastrService.warning('Por favor, Preencha os campos.', `Aviso!`);
      }
    } else {
      this.limparCamposFase();
    }
  }
  
  limparCamposFase() {
    this.tipoJusticaConfig = null;
    this.tribunalConfig = null;
    this.codFase = 0;
    this.codTribunalFase = "";
    this.descricaoFase = "";
    this.myControl.setValue('');
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
      let tip = this.tiposJusticaConfig.filter((tj) => tj.descricao == event.data.tribunal.tipo);
      if (tip != null && tip.length == 1) {
        this.tipoJusticaConfig = tip[0];
      }
      this.carregarTribunalConfig(this.tipoJusticaConfig, true, event.data.tribunal);
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.faseElement.nativeElement.focus();
      },0);  
    } 
  }

  //excluir fase
  onDeleteConfirm(event): void {
    if (window.confirm('Deseja excluir?')) {
      this.inovacnjService.deletarFase(event.data).subscribe(data => {
        this.dadosTabelaFase.remove(event.data);
        this.limparCamposFase();
        this.toastrService.success('Fase Removida com Sucesso!', `Sucesso!`);
      });
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
    let mov = this.movimentos.filter((item) => item.codigo == val.codigo);
    if (mov == null || mov.length < 1) {
      this.movimentos.push(val);
    }
    this.myControl.setValue('');
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
