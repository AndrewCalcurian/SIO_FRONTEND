import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AlmacenComponent } from './almacen.component';
import { MainComponent } from './main/main.component';
import { ReportesComponent } from './reportes/reportes.component';

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
