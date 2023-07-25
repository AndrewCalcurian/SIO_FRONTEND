import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';

import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

// const consultaDolar = require('consulta-dolar-venezuela');

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor(private api:RestApiService,
    private route:ActivatedRoute) {
   }
   
  public rangos:boolean = false;
  public nuevo_departamento:boolean = false;
  public rangos_dep = []
  public Departamentos;
  public roles_seleccionados = []

  ngOnInit(): void {
    this.BuscarDepartamentos()
  }

  BuscarDepartamentos(){
    this.api.GetDepartamento()
      .subscribe((resp:any)=>{
        this.Departamentos = resp;
        console.log(this.Departamentos)
      })
  }

  ver_rangos(i){
    this.rangos = true;
    this.roles_seleccionados = this.Departamentos[i].roles
  }

  cerrarModal(){
    this.rangos = false;
  }

  Agregar_Rango(){

    let nuevo_rango = (<HTMLInputElement>document.getElementById('Rango_nuevo')).value;
    this.rangos_dep.push(nuevo_rango);
    (<HTMLInputElement>document.getElementById('Rango_nuevo')).value = '';
    (<HTMLInputElement>document.getElementById('Rango_nuevo')).focus()


  }

  delete(i){
    this.rangos_dep.splice(i,1)
  }

  NuevoDespartamento(){
    if(this.nuevo_departamento){
      this.nuevo_departamento = false;
    }else{
      this.nuevo_departamento = true;
    }
  }

  NuevoDepartamento(){
    let departamento = (<HTMLInputElement>document.getElementById('Departamento')).value
    let data = {
      departamento,
      roles:this.rangos_dep
    }

    this.api.postDepartamento(data)
      .subscribe((resp:any)=>{
        (<HTMLInputElement>document.getElementById('Departamento')).value = '';
        this.rangos_dep = []
        this.BuscarDepartamentos()
        this.NuevoDespartamento()
        Swal.fire({
          icon:'success',
          title:'Nuevo departamento',
          text:'Se registró nuevo departamento',
          showConfirmButton:false,
          timer:1500,
          timerProgressBar:true
        })
      })
  }

  
}

