import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CotizacionComponent } from './cotizacion.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { GestionComponent } from './gestion/gestion.component';
import { PreFacturacionComponent } from './pre-facturacion/pre-facturacion.component';
import { MainComponent } from './main/main.component';
import { TokenValidationComponent } from '../token-validation/token-validation.component';



@NgModule({
  declarations: [CotizacionComponent, GestionComponent, PreFacturacionComponent, MainComponent, TokenValidationComponent],
  imports: [
    SharedModule,
    CommonModule,
    CotizacionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class CotizacionModule { }
