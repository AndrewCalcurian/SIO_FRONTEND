import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// import { MainComponent } from './index/main/main.component';
import { OrdenComponent } from './orden/orden.component';
import { PlanificacionComponent } from './planificacion/planificacion.component';
import { LoginComponent } from './login/login.component';
import { BarChartComponent} from './bar-chart/bar-chart.component';
import { AuthGuard } from './Auth/auth-guard.guard';
import { TokenValidationComponent } from './token-validation/token-validation.component';

const routes: Routes = [
  {
    path:'',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./index/index.module').then(m => m.IndexModule),
  },
  {
    path:'orden-produccion/:id',
    canActivate: [AuthGuard],
    component:OrdenComponent
  },
  {
    path: 'orden',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./nuevo-pedido/nuevo-pedido.module').then(m => m.NuevoPedidoModule)
  },
  {
    path: 'gestiones',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./producto-ymaquinaria/producto-ymaquinaria.module').then(m=> m.ProductoYMaquinariaModule)
  },
  {
    path: 'almacen',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./almacen/almacen.module').then(m=>m.AlmacenModule)
  },
  {
    path: 'ordenes',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./ordenes/ordenes.module').then(m=>m.OrdenesModule)
  },
  {
    path: 'estadisticas',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./estadisticas/estadisticas.module').then(m=>m.EstadisticasModule)
  },
  {
    path: 'ventas',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./cotizacion/cotizacion.module').then(m=>m.CotizacionModule)
  },
  {
    path: 'planificacion',
    canActivate: [AuthGuard],
    component:PlanificacionComponent
  },
  {
    path: 'pruebas',
    component:BarChartComponent
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'verificacion',
    component:TokenValidationComponent
  }

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot( routes )
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
