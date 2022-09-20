import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { OrdenesRoutingModule } from './ordenes-routing.module';
import { GestionComponent } from './gestion/gestion.component';
import { DevolucionComponent } from './gestion/devolucion/devolucion.component';
import { SolcitudComponent } from './gestion/solcitud/solcitud.component';



@NgModule({
  declarations: [MainComponent, GestionComponent,DevolucionComponent,SolcitudComponent],
  imports: [
    CommonModule,
    OrdenesRoutingModule
  ]
})
export class OrdenesModule { }
