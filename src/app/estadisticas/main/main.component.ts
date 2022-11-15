import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private api:RestApiService,
    private router:Router,) { }

  ngOnInit(): void {
  }

  public Ordenes = []

  public cargando = false;
  public sinBusqueda = true;
  public vacio = false;

  alert(id){
    this.router.navigateByUrl(`orden-produccion/${id}`)
  }

  GetDespacho(orden){
    this.api.GetDespachoByOrden(orden)
      .subscribe((resp:any)=>{
        if(resp.length < 1){
          return "Sin Despachar"
        }else{
          resp.fecha
        }
      })
  }

  Buscar_estadisticas(desde, hasta){
    this.vacio = false;
    this.sinBusqueda = false;
    this.cargando = true;
    if(!desde || !hasta){
      this.cargando = false;
      this.sinBusqueda = true;
      Swal.fire({
        title:'Debes seleccionar 2 fechas',
        text:'Debes indicar un intervalo de busqueda valido (Fecha inicial de busqueda hasta fecha final).',
        icon:'error',
        showConfirmButton:false,
      })
      return
    }
    if(desde > hasta){
      this.cargando = false;
      this.sinBusqueda = true;
      Swal.fire({
        title:'Error en la busqueda',
        text:'La fecha de inicio no puede ser mayor a la fecha final',
        icon:'error',
        showConfirmButton:false
      })
      return
    }



    this.api.EstadisticasOrden({desde,hasta})
      .subscribe((resp:any)=>{
        if(resp.length < 1){
          this.vacio = true;
        }
        this.Ordenes = resp
        this.cargando = false
      })
  }

}
