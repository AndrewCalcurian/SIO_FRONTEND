import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { EstadisticasRoutingModule } from './estadisticas-routing.module';
import { EstadisticasComponent } from './estadisticas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';





@NgModule({
  declarations: [MainComponent,EstadisticasComponent],
  imports: [
    SharedModule,
    CommonModule,
    EstadisticasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class EstadisticasModule { }
