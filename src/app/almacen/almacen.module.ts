import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { AlmacenRoutingModule } from './almacen-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SolcitudComponent } from './main/solcitud/solcitud.component';
import { AsignacionComponent } from './main/asignacion/asignacion.component';
import { ConfirmacionComponent } from './main/confirmacion/confirmacion.component';




@NgModule({
  declarations: [MainComponent, SolcitudComponent, AsignacionComponent, ConfirmacionComponent],
  imports: [
    CommonModule,
    AlmacenRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AlmacenModule { }
