import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';

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
  public adicionales = []


  public cargando = false;
  public sinBusqueda = true;
  public vacio = false;


  public Tinta = 0;
  public Amarillo =0;
  public Cyan = 0;
  public Magenta =0;
  public Negro = 0;
  public Otros_c = 0;

  public chart: any;


  // test grafica


  // test grafica

  public DetallesTinta:boolean = false;
  modalTintas(){
    if(this.DetallesTinta){
      this.DetallesTinta = false
    }else{
      this.DetallesTinta = true;
    }
  }

  alert(id){
    this.router.navigateByUrl(`orden-produccion/${id}`)
  }

  public Sustratos_suma = []
  public total_sustrato = 0;
  public Sustrato_load:boolean = true
  sumaSustrato(){
    this.peso_hojas = 0;
    this.peso_carton = 0;
    this.Sustratos_suma = []
    this.total_sustrato = 0;
    this.Sustrato_load = true;
    for(let i=0;i<this.Lotes.length;i++){
      for(let x=0;x<this.Lotes[i].material.length;x++){
        if(this.Lotes[i].material[x].material.grupo === '61f92a1f2126d717f004cca6'){
          let data = {
            Nombre:this.Lotes[i].material[x].material.nombre,
            Marca:this.Lotes[i].material[x].material.marca,
            Ancho:this.Lotes[i].material[x].material.ancho,
            Largo:this.Lotes[i].material[x].material.largo,
            Calibre:this.Lotes[i].material[x].material.calibre,
            Gramaje:this.Lotes[i].material[x].material.gramaje,
            Cantidad:this.Lotes[i].material[x].cantidad
          }
          let existe = this.Sustratos_suma.findIndex(x=> x.Nombre === data.Nombre && x.Marca === data.Marca && x.Ancho === data.Ancho && x.Largo === data.Largo && x.Calibre === data.Calibre && x.Gramaje === data.Gramaje)

          if(existe < 0){
            this.Sustratos_suma.push(data)
            console.log(this.Sustratos_suma)
          }else{
            this.Sustratos_suma[existe].Cantidad = Number(this.Sustratos_suma[existe].Cantidad) + Number(data.Cantidad)
          }
        }
      }
    }
    this.Sustrato_load=false;
  }

  public peso_carton = 0;
  public peso_hojas = 0;
  MostrarPeso(w,x,y,z){

    let all = Number(w)*Number(x)*Number(y)*Number(z);
    let peso = all /10000000000;

    if(x < 100){
      this.peso_hojas = this.peso_hojas + peso;
    }else{
      this.peso_carton = this.peso_carton + peso;
    }

    this.total_sustrato = Number(this.total_sustrato) + Number(peso)
    return peso.toFixed(2)
  }

  public Tinta_load:boolean = true
  public Suma_Tintas = [];
  sumaTinta(){
    this.Tinta = 0;
    this.Suma_Tintas = []
    for(let i=0;i<this.Lotes.length;i++){
      for(let x=0;x<this.Lotes[i].material.length;x++){
        if(this.Lotes[i].material[x].material.grupo === '61fd54e2d9115415a4416f17')
        {
          this.Tinta = this.Tinta + this.Lotes[i].material[x].EA_Cantidad
          
          switch(this.Lotes[i].material[x].material.color){
            case 'Amarillo':
              this.Amarillo = this.Amarillo + this.Lotes[i].material[x].EA_Cantidad
              break;
            case 'Cyan':
              this.Cyan = this.Cyan + this.Lotes[i].material[x].EA_Cantidad
              break;
            case 'Magenta':
              this.Magenta = this.Magenta + this.Lotes[i].material[x].EA_Cantidad
              break;
            case 'Negro':
              this.Negro = this.Negro + this.Lotes[i].material[x].EA_Cantidad
              break;
            default:
              this.Otros_c = this.Otros_c + this.Lotes[i].material[x].EA_Cantidad
              break;
          }
          // console.log(this.Lotes[i].material[x].material.color)
          let data = {
            Nombre: this.Lotes[i].material[x].material.nombre,
            Marca:this.Lotes[i].material[x].material.marca,
            Cantidad: this.Lotes[i].material[x].EA_Cantidad
          }

          let existe = this.Suma_Tintas.findIndex(x=> x.Nombre === data.Nombre && x.Marca === data.Marca)

          if(existe < 0){
            this.Suma_Tintas.push(data)
          }else{
            this.Suma_Tintas[existe].Cantidad = Number(this.Suma_Tintas[existe].Cantidad) + Number(data.Cantidad)
          }
        }
      }
      if(i == this.Lotes.length - 1){
        this.Tinta_load = false;
      }
    }
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
          this.adicionales = resp.Adicionales
          console.log(this.Lotes)
          this.cargando = false
          this.sumaTinta();
          this.sumaSustrato();
        })

  }

  devoluciones_(id,op){
    let data = 0;
    let x = 0
    let y = 0
      for(let i=0;i<this.c_devoluciones.length;i++){
        x++
        y = 0
        let len = this.c_devoluciones[i].filtrado
        for(let n=0;n<len.length;n++){
          y++;
          if(this.c_devoluciones[i].filtrado[n].material == id){
            data = data + this.c_devoluciones[i].filtrado[n].cantidad;
            // console.log(this.c_devoluciones[i].filtrado[n])
          }
          if(x == this.c_devoluciones.length && y == len.length){
            if(data > 0){
              return data.toFixed(2);
            }else{
              return data
            }
          }
        }
      }
  
      // let dev_filtered = this.c_devoluciones.filter(x=> x.filtrado.material === id)
      // console.log(dev_filtered)
      // if(dev_filtered.length > 0){
      //   return '150'
      // }else{
      //   return '0'
      // }
  
      // for(let i=0;i<this.c_devoluciones.length;i++){
      //   let len = this.c_devoluciones[i].filtrado
      //   for(let n=0;n<len.length;n++){
      //     if(this.c_devoluciones[i].filtrado[n].material === id){
      //       let duplicado = this.devoluc.find(x => x.material == id);
      //       if(duplicado){
      //         let index_ = this.devoluc.findIndex(x=> x.material == id) 
      //         this.devoluc[index_].cantidad = this.devoluc[index_].cantidad + this.c_devoluciones[i].filtrado[n].cantidad
      //       }else{
      //         this.devoluc.push({material:id, cantidad:this.c_devoluciones[i].filtrado[n].cantidad})
      //       }
      //     }
      //   }
      // }
    }

}
