import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AlmacenComponent } from './almacen.component';
import { MainComponent } from './main/main.component';
import { ReportesComponent } from './reportes/reportes.component';
import { RecepcionComponent } from './recepcion/recepcion.component';

const routes: Routes =[
  {
    path:'',
    component:AlmacenComponent,
    children:[
      {
        path:'',
        component:MainComponent
      },
      {
        path:'reportes',
        component:ReportesComponent
      },
      {
        path:'recepcion',
        component:RecepcionComponent
      }
    ]
}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})

export class AlmacenRoutingModule { }
