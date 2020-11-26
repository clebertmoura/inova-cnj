import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { InovacnjService } from 'app/@core/services/inovacnj.service';
import { TipoJustica } from 'app/models/tipo-justica';
import { Tribunal } from 'app/models/tribunal';
import { Natureza } from 'app/models/natureza';
import { Classe } from 'app/models/classe';
import { OrgaoJulgador } from '../../../models/orgao-julgador';
import { NbCalendarRange, NbSelectComponent } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { TipoOrgao } from '../../../models/tipo-orgaoJulgador';
import { Observable } from 'rxjs/internal/Observable';
import { startWith, map } from 'rxjs/operators';
import { AtuacaoOrgaoJulgador } from 'app/models/atuacao-orgaojulgador';
import { Cluster } from 'app/models/cluster';

export class Filtro {

  constructor(
    public tipoJustica?: TipoJustica,
    public tribunal?: Tribunal,
    public orgaoJulgador?: OrgaoJulgador,
    public atuacaoOrgaoJulgador?: AtuacaoOrgaoJulgador,
    public natureza?: Natureza,
    public classe?: Classe,
    public cluster?: Cluster,
    public baixado: boolean = true,
    public rangeDatas?: NbCalendarRange<Date>) {
  }
}

@Component({
  selector: 'ngx-filtro',
  styleUrls: ['./filtro.component.scss'],
  templateUrl: './filtro.component.html',
})
export class FiltroComponent implements OnInit, OnDestroy {

  @Input() buttonOkLabel: string;
  @Input() buttonCancelLabel: string;

  @Input() selectAtuacaoOrgaoJulgador: NbSelectComponent;

  @Input() showModoComparacao: boolean = false;
  @Input() showOrgaoJulgador: boolean = false;
  @Input() showAtuacaoOrgaoJulgador: boolean = false;
  @Input() showNatureza: boolean = false;
  @Input() showClasse: boolean = false;
  @Input() showCluster: boolean = false;
  @Input() showRangeDatas: boolean = false;
  @Input() showProcessosCompletos: boolean = false;

  @Output() okClicked = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();

  @Output() onTipoJusticaSelected = new EventEmitter();
  @Output() onTribunalSelected = new EventEmitter();
  @Output() onOrgaoJulgadorSelected = new EventEmitter();
  @Output() onAtuacaoOrgaoJulgadorSelected = new EventEmitter();
  @Output() onNaturezaSelected = new EventEmitter();
  @Output() onClasseSelected = new EventEmitter();
  @Output() onClusterSelected = new EventEmitter();
  @Output() onModoComparacaoSelected = new EventEmitter();

  loading = false;

  tiposJustica: TipoJustica[] = [];
  tipoJustica: TipoJustica;
  tribunais: Tribunal[] = [];
  tribunal: Tribunal;
  orgaosJulgadores: OrgaoJulgador[] = [];
  filteredOrgaosJulgadores$: Observable<OrgaoJulgador[]>;
  orgaoJulgador: OrgaoJulgador;
  atuacoesOrgaoJulgador: AtuacaoOrgaoJulgador[] = [];
  atuacaoOrgaoJulgador: AtuacaoOrgaoJulgador;
  naturezas: Natureza[] = [];
  natureza: Natureza;
  classes: Classe[] = [];
  classe: Classe;
  clusters: Cluster[] = [];
  cluster: Cluster;
  baixado: boolean = true;
  dataInicial = new Date();
  dataFinal = new Date();
  rangeDatas: NbCalendarRange<Date>;
  modoComparacaoSelectedOption: number = 1;

  orgaoJulgadorFormControl: FormControl = new FormControl();

  dashboardUrl: any;

  constructor(
    private inovacnjService: InovacnjService,
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private datePipe: DatePipe) {
      console.log('FiltroComponent');
  }

  ngOnInit(): void {
    this.resetFilters();
    this.carregarTipoJustica();
  }

  resetFilters() {
    this.tribunal = null;
    this.orgaoJulgador = null;
    this.atuacaoOrgaoJulgador = null;
    this.cluster = null
    this.natureza = null;
    this.classe = null;
    this.baixado = true;
    this.modoComparacaoSelectedOption = 0;
  }

  setLoading(value: boolean) {
    this.loading = value;
  }

  onButtonOkClicked() {
    console.log('onButtonOkClicked');
    this.okClicked.emit(this.getSelectedDataObject());
  }

  onButtonCancelClicked() {
    console.log('onButtonCancelClicked');
    this.resetFilters();
    if (this.orgaoJulgadorFormControl) {
      this.orgaoJulgadorFormControl.setValue('');
    }
    this.cancelClicked.emit(this.getSelectedDataObject());
  }

  getSelectedDataObject(): Filtro {
    return new Filtro(
      this.tipoJustica,
      this.tribunal,
      this.orgaoJulgador,
      this.atuacaoOrgaoJulgador,
      this.natureza,
      this.classe,
      this.cluster,
      this.baixado,
      this.rangeDatas);
  }

  /**
   * Configura a URL do Dashboard
   */
  setDashboardUrl(): any {
    let url = 'http://161.97.71.108:3000/public/dashboard/';
    if (this.tipoJustica != null) {
      switch(this.tipoJustica.codigo) {
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
      url += `?justi%25C3%25A7a=${this.tipoJustica.codigo}`
    } else {
      url += `?`
    }
    if (this.tribunal != null) {
      url += `&tribunal=${this.tribunal.codigo}`
    }
    if (this.orgaoJulgador != null) {
      url += `&%25C3%25B3rg%25C3%25A3o_julgador=${this.orgaoJulgador.descricao}`
    }
    if (this.natureza != null) {
      url += `&natureza=${this.natureza.descricao}`
    }
    if (this.classe != null) {
      url += `&classe=${this.classe.descricao}`
    }
    if (this.rangeDatas != null) {
      if (this.rangeDatas.start != null && this.rangeDatas.end != null) {
        const dateStart = this.datePipe.transform(this.rangeDatas.start,"yyyy-MM-dd");
        const dateEnd = this.datePipe.transform(this.rangeDatas.end,"yyyy-MM-dd");
        url += `&datas=${dateStart}~${dateEnd}`;
      }
    }
    console.log(url);
    this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  carregarTipoJustica() {
    this.loading = true;
    return this.inovacnjService.consultarTipoJustica()
      .subscribe((tiposJustica : TipoJustica[]) => {
        this.tiposJustica = tiposJustica;
        if (this.tipoJustica == null) {
          const tipoEstadual = tiposJustica.filter((tj) => tj.codigo == 'Estadual');
          if (tipoEstadual != null && tipoEstadual.length == 1) {
            const tipoJustica = tipoEstadual[0];
            this.tipoJustica = tipoJustica;
          }
        }
        this.loading = false;
        this.onSelectTipoJustica(this.tipoJustica);
      }, error => {
        console.error(error);
        this.loading = false;
      });
  }

  onSelectTipoJustica(tipoJustica: TipoJustica) {
    this.loading = true;
    this.tipoJustica = tipoJustica;
    this.tribunal = null;
    this.orgaoJulgador = null;
    this.atuacaoOrgaoJulgador = null;
    this.natureza = null;
    this.classe = null;
    this.cluster = null;
    return forkJoin(
      this.inovacnjService.consultarTribunal(tipoJustica),
      this.inovacnjService.consultarNatureza(tipoJustica),
      this.inovacnjService.consultarAtuacaoOrgaoJulgador(tipoJustica, null),
      this.inovacnjService.consultarCluster(tipoJustica, null)
    ).subscribe(([tribunais, naturezas, atuacoesOrgaoJulgador, clusters]: [Tribunal[], Natureza[], AtuacaoOrgaoJulgador[], Cluster[]]) => {
        this.loading = false;
        this.tribunais = tribunais;
        this.naturezas = naturezas;
        this.atuacoesOrgaoJulgador = atuacoesOrgaoJulgador;
        if (atuacoesOrgaoJulgador != null && atuacoesOrgaoJulgador.length == 1) {
          this.atuacaoOrgaoJulgador = atuacoesOrgaoJulgador[0];
        }
        this.clusters = clusters;
        this.onTipoJusticaSelected.emit(this.getSelectedDataObject());
      }, error => {
        console.error(error);
        this.loading = false;
        this.onTipoJusticaSelected.emit(this.getSelectedDataObject());
      });
  }

  onSelectTribunal(tribunal: Tribunal) {
    this.loading = true;
    this.tribunal = tribunal;
    this.orgaoJulgador = null;
    this.atuacaoOrgaoJulgador = null;
    this.cluster = null;
    this.orgaoJulgadorFormControl.setValue('');
    this.onTribunalSelected.emit(this.getSelectedDataObject());
    if (this.showOrgaoJulgador) {
      this.inovacnjService.consultarOrgaoJulgador(tribunal)
        .subscribe((orgaosJulgadores : OrgaoJulgador[]) => {
          this.orgaosJulgadores = orgaosJulgadores;
          this.filteredOrgaosJulgadores$ = of(this.orgaosJulgadores);
          this.filteredOrgaosJulgadores$ = this.orgaoJulgadorFormControl.valueChanges
            .pipe(
              startWith(''),
              map(filterString => this.filterOrgaoJulgador(filterString)),
            );
          this.loading = false;
        }, error => {
          console.error(error);
          this.loading = false;
        });
    }
    if (this.showAtuacaoOrgaoJulgador) {
      this.inovacnjService.consultarAtuacaoOrgaoJulgador(this.tipoJustica, tribunal)
        .subscribe((ataucoes : AtuacaoOrgaoJulgador[]) => {
          this.atuacoesOrgaoJulgador = ataucoes;
          this.loading = false;
        }, error => {
          console.error(error);
          this.loading = false;
        });
    }
    if (this.showOrgaoJulgador == false && this.showAtuacaoOrgaoJulgador == false) {
      this.loading = false;
    }
    return;
  }

  onChangeModoComparacao(event) {
    console.log('onChangeModoComparacao', event);
    if (event == 2) {
      this.tribunal = null;
    }
    this.onModoComparacaoSelected.emit(this.getSelectedDataObject());
  }

  private filterOrgaoJulgador(value: string): OrgaoJulgador[] {
    const filterValue = value.toLowerCase();
    return this.orgaosJulgadores.filter(optionValue => optionValue.descricao.toLowerCase().includes(filterValue));
  }

  viewOrgaoJulgadorHandle(orgaoJulgador: any) {
    if (typeof orgaoJulgador === 'string') {
      return orgaoJulgador.toUpperCase();
    } else {
      return orgaoJulgador.descricao.toUpperCase();
    }
  }

  onSelectOrgaoJulgador(orgaoJulgador: OrgaoJulgador) {
    this.orgaoJulgador = orgaoJulgador;
    this.onOrgaoJulgadorSelected.emit(this.getSelectedDataObject());
  }

  onSelectAtuacaoOrgaoJulgador(atuacaoOrgaoJulgador: AtuacaoOrgaoJulgador) {
    this.cluster = null;
    this.atuacaoOrgaoJulgador = atuacaoOrgaoJulgador;
    if (this.showCluster) {
      this.inovacnjService.consultarCluster(this.tipoJustica, this.atuacaoOrgaoJulgador)
      .subscribe((clusters : Cluster[]) => {
        this.clusters = clusters;
        this.loading = false;
      }, error => {
        console.error(error);
        this.loading = false;
      });  
    }
    this.onAtuacaoOrgaoJulgadorSelected.emit(this.getSelectedDataObject());
  }

  onSelectNatureza(natureza: Natureza) {
    this.loading = true;
    this.natureza = natureza;
    this.classe = null;
    this.onNaturezaSelected.emit(this.getSelectedDataObject());
    return this.inovacnjService.consultarClasse(natureza)
      .subscribe((classes : Classe[]) => {
        this.classes = classes;
        this.loading = false;
      }, error => {
        console.error(error);
        this.loading = false;
      });
  }

  onSelectClasse(classe: Classe) {
    this.classe = classe;
    this.onClasseSelected.emit(this.getSelectedDataObject());
  }

  onSelectCluster(cluster: Cluster) {
    this.cluster = cluster;
    this.onClusterSelected.emit(this.getSelectedDataObject());
  }

  public exibirTribunal():boolean {
    if (this.showModoComparacao) {
      if (this.modoComparacaoSelectedOption != null && this.modoComparacaoSelectedOption == 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  public exibirCluster():boolean {
    if (this.showCluster) {
      if (this.modoComparacaoSelectedOption != null && this.modoComparacaoSelectedOption == 2) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  ngOnDestroy() {
  }
}
