import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbCalendarModule,
  NbStepperModule,
  NbInputModule,
  NbCheckboxModule,
  NbDatepickerModule, 
  NbCalendarRangeModule,
  NbSpinnerModule,
  NbAutocompleteModule,
} from '@nebular/theme';

import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FiltroComponent } from './filtro/filtro.component';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    NgPipesModule,
    NbCardModule,
    NbUserModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    NbCalendarModule,
    NbCalendarRangeModule,
    NbStepperModule,
    NgxChartsModule,
    Ng2SmartTableModule,
    ThemeModule,
    NbInputModule,
    NbCheckboxModule,
    NbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatSliderModule,
    MatRadioModule,
    MatAutocompleteModule, 
    MatFormFieldModule,
    MatInputModule,
    NbSpinnerModule,
    NbAutocompleteModule,
  ],
  declarations: [
    DashboardComponent,
    FiltroComponent
  ],
})
export class DashboardModule { }
