import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LaboratorioComponent } from './laboratorio.component';
import { MainComponent } from './main/main.component';
import { MateriaPrimaComponent } from './materia-prima/materia-prima.component';
import { ProductoTerminadoComponent } from './producto-terminado/producto-terminado.component';
import { IndexComponent } from './index/index.component';
import { EspecificacionComponent } from './especificacion/especificacion.component';



const routes: Routes =[
  {
    path:'',
    component:LaboratorioComponent,
    children:[
      {
        path:'',
        component:MainComponent
      },
      {
        path:'especificaciones',
        component:IndexComponent,
      },
      {  
        path:'materia-prima',
        component:MateriaPrimaComponent
      },
      {
        path:'producto-terminado',
        component:ProductoTerminadoComponent
      },
      {
        path:'especificacion/:producto',
        component:EspecificacionComponent
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

export class LaboratorioRoutingModule { }
