import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CotizacionComponent } from './cotizacion.component';
import { MainComponent } from './main/main.component';
import { GestionComponent } from './gestion/gestion.component';
import { PreFacturacionComponent } from './pre-facturacion/pre-facturacion.component';

const routes: Routes =[
  {
    path:'',
    component:CotizacionComponent,
    children:[
      {
        path:'',
        component:MainComponent
      },
      {
        path:'gestion',
        component:GestionComponent
      },
      {
        path:'pre-facturacion',
        component:PreFacturacionComponent
      },]
}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CotizacionRoutingModule { }
