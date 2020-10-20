import { Component, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { InovacnjService } from 'app/@core/services/inovacnj.service';
import { TipoJustica } from 'app/models/tipo-justica';
import { Tribunal } from 'app/models/tribunal';
import { Natureza } from 'app/models/natureza';
import { Classe } from 'app/models/classe';

@Component({
  selector: 'ngx-filtro',
  styleUrls: ['./filtro.component.scss'],
  templateUrl: './filtro.component.html',
})
export class FiltroComponent implements OnDestroy {

  private alive = true;

  tiposJustica: TipoJustica[] = [];
  tipoJustica: TipoJustica;
  tribunais: Tribunal[] = [];
  tribunal: Tribunal;
  naturezas: Natureza[] = [];
  natureza: Natureza;
  classes: Classe[] = [];
  classe: Classe;
  dataInicial = new Date();
  dataFinal = new Date();

  constructor(private inovacnjService: InovacnjService) {
    forkJoin(
      this.inovacnjService.consultarTipoJustica(),
      this.inovacnjService.consultarTribunal(),
      this.inovacnjService.consultarNatureza(),
      this.inovacnjService.consultarClasse(),
    )
      .pipe(takeWhile(() => this.alive))
      .subscribe(([tiposJustica, tribunais, naturezas, classes]: [TipoJustica[], Tribunal[], Natureza[], Classe[]]) => {
        this.tiposJustica = tiposJustica;
        this.tribunais = tribunais;
        this.naturezas = naturezas;
        this.classes = classes;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
