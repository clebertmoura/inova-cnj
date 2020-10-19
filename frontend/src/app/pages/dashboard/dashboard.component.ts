import {Component, OnDestroy, ViewChild} from '@angular/core';
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

export class DashboardComponent implements OnDestroy {
  
  options: CloudOptions = {
    width: 1000,
    height: 400,
    overflow: false,
    realignOnResize: false,
  };

  data: CloudData[] = [
    { text: 'aaaa', weight: 5, rotate: 10 },
    { text: 'bbbb', weight: 7, rotate: -20 },
    { text: 'cccc', weight: 9, rotate: 35 },
  ];

  historicoFases = {};
  dadosFases : LocalDataSource = new LocalDataSource();
  alertas = {};
  
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

  private alive = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  date = new Date();
  date2 = new Date();
 
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

  constructor(private themeService: NbThemeService,
              private inovacnjService: InovacnjService) {

    this.themeSubscription = this.themeService.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });

  }

  ngOnDestroy(): void {
    this.alive = false;
    this.themeSubscription.unsubscribe();
  }

  pesquisarNpu(npu) {
    if (this.inovacnjService.getExisteNpu(npu)) {
      this.dadosFases.load(this.inovacnjService.getDadosFases());
      this.alertas = this.inovacnjService.getAlertas();
      this.historicoFases = this.inovacnjService.getHistoricoFases();
    } 
  }
}
