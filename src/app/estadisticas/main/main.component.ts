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
  public Despachos = []
  public Lotes = []
  public despachos = []
  public devoluciones = []
  public gestiones = []
  public requisiciones = []
  public trabajos = []


  public cargando = false;
  public sinBusqueda = true;
  public vacio = false;

  alert(id){
    this.router.navigateByUrl(`orden-produccion/${id}`)
  }

  GetDespacho(orden){
    // alert(orden)
    let despacho = this.Despachos.find(despacho => despacho.despacho.op == orden)
    for(let i = 0; i<this.Despachos.length;i++){
      for(let y = 0; y<this.Despachos[i].despacho.length;y++){
        if(this.Despachos[i].despacho[y].op == orden){
          return(this.Despachos[i].fecha)
        }
      }
    }
    return 'Sin despachar'
  }

  public g_trabajos = []
  public g_gestiones = []
  public modal_gestiones = false;
  gestiones_(id,op){
    this.g_trabajos = this.trabajos.filter(x => x.orden === id)
    this.g_gestiones = this.gestiones.filter(x => x.op === id)
    this.modal_gestiones = true;
    
  }

  public c_lotes = []
  public c_devoluciones = []
  public lote_mayor:any = [];
  public modal_consumos = false;
  consumos(id,op){
    this.lote_mayor = []
    this.c_devoluciones = []
    this.c_devoluciones = this.devoluciones.filter(x=> x.orden === op)
    this.c_lotes = this.Lotes.filter(x => x.orden === op)
    for(let i=0; i<this.c_lotes.length;i++){
      for(let n=0; n<this.c_lotes[i].material.length;n++)
      {

        let index = this.lote_mayor.find(x=> x.nombre === this.c_lotes[i].material[n].material.nombre)
        
        if(!index){
          let marca = this.c_lotes[i].material[n].material.marca
          let id = this.c_lotes[i].material[n].material._id
          let cant = this.c_lotes[i].material[n].cantidad
          // cant = cant.toFixed(2)
          if(this.c_lotes[i].material[n].material.ancho){
            let ancho = this.c_lotes[i].material[n].material.ancho
            let largo = this.c_lotes[i].material[n].material.largo
            this.lote_mayor.push({op,id,marca,nombre:this.c_lotes[i].material[n].material.nombre, cantidad:cant,ancho,largo})
          }else{
            this.lote_mayor.push({op,id,marca,nombre:this.c_lotes[i].material[n].material.nombre, cantidad:cant})
          }
        }else{
          let b = this.lote_mayor.findIndex(x=> x.nombre === this.c_lotes[i].material[n].material.nombre)
          this.lote_mayor[b].cantidad = Number(this.lote_mayor[b].cantidad) + Number(this.c_lotes[i].material[n].cantidad)
        }


      }
    }
    this.modal_consumos = true;
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
          this.Ordenes = resp.orden
          this.Despachos = resp.despachos
          this.devoluciones = resp.devoluciones
          this.gestiones = resp.gestiones
          this.Lotes = resp.lotes
          this.requisiciones = resp.requisiciones
          this.trabajos = resp.trabajos
          this.cargando = false

        })

  }

}
