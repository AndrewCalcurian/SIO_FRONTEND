import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaboratorioComponent } from '../laboratorio/laboratorio.component';
import { MainComponent } from './main/main.component';
import { MateriaPrimaComponent } from './materia-prima/materia-prima.component';
import { ProductoTerminadoComponent } from './producto-terminado/producto-terminado.component';
import { LaboratorioRoutingModule } from './laboratorio-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndexComponent } from './index/index.component';
import { EspecificacionComponent } from './especificacion/especificacion.component';
import { AnalisisSustratoComponent } from './analisis-sustrato/analisis-sustrato.component';



@NgModule({
  declarations: [LaboratorioComponent, MainComponent, MateriaPrimaComponent, ProductoTerminadoComponent, IndexComponent, EspecificacionComponent, AnalisisSustratoComponent],
  imports: [
    CommonModule,
    LaboratorioRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LaboratorioModule { }
