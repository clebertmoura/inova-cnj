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
  NbDatepickerModule, NbCalendarRangeModule
} from '@nebular/theme';

import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomSelectorComponent } from './rooms/room-selector/room-selector.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { TemperatureDraggerComponent } from './temperature/temperature-dragger/temperature-dragger.component';
import { KittenComponent } from './kitten/kitten.component';
import { SecurityCamerasComponent } from './security-cameras/security-cameras.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { ElectricityChartComponent } from './electricity/electricity-chart/electricity-chart.component';
import { WeatherComponent } from './weather/weather.component';
import { SolarComponent } from './solar/solar.component';
import { PlayerComponent } from './rooms/player/player.component';
import { TrafficComponent } from './traffic/traffic.component';
import { TrafficChartComponent } from './traffic/traffic-chart.component';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsRoutingModule } from '../forms/forms-routing.module';
import { FiltroComponent } from './filtro/filtro.component';
import { MatListModule } from '@angular/material/list';
import { TagCloudModule } from 'angular-tag-cloud-module';


@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
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
    FormsRoutingModule,
    FormsModule,
    MatListModule,
    TagCloudModule
  ],
  declarations: [
    DashboardComponent,
    FiltroComponent,
    StatusCardComponent,
    TemperatureDraggerComponent,
    ContactsComponent,
    RoomSelectorComponent,
    TemperatureComponent,
    RoomsComponent,
    KittenComponent,
    SecurityCamerasComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    WeatherComponent,
    PlayerComponent,
    SolarComponent,
    TrafficComponent,
    TrafficChartComponent,
  ],
})
export class DashboardModule { }
