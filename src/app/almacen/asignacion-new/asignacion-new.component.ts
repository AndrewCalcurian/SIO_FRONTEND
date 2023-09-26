import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-asignacion-new',
  templateUrl: './asignacion-new.component.html',
  styleUrls: ['./asignacion-new.component.css']
})
export class AsignacionNewComponent implements OnInit {

  constructor(private api:RestApiService) { }

  ngOnInit(): void {
    this. BuscarUnaOrden();
  }

  public Asignar:boolean = false;
  public ordenes = []
  public loading_:boolean = true;

  // TOTAL A ASIGNAR
  public Total
  //LOTES ENCONTRADOS
  public Lotes_encontrados = []
  // CANTIDAD QUE SE VA SUMANDO
  public sumando = 0
  // RESTANTES DE CADA PRODUCTO
  public restante = []


  asignar(i,n){
    if(!this.Asignar){
      this.Asignar = true

      let material = this.ordenes[i].producto.materiales[this.ordenes[i].montaje][n]
      let parametro
      if(material.producto.grupo.nombre === 'Tinta'){
         this.Total = ((material.cantidad * this.ordenes[i].paginas)/1000).toFixed(2)
         parametro = {material:material.producto._id, cantidad:{$gt:0}}
      }
      if(material.producto.grupo.nombre === 'Sustrato'){
        this.Total = (this.ordenes[i].paginas).toFixed(2)
        parametro = {material:material.producto._id, cantidad:{$gt:0}}
      }
      if(material.producto.grupo.nombre === 'Cajas Corrugadas'){
        this.Total = Math.ceil(this.ordenes[i].cantidad / material.cantidad)
        parametro = {material:material.producto._id, cantidad:{$gt:0}}
      }

         this.api.BUSCARENALMACENPRODUCTO(parametro)
          .subscribe((resp:any)=>{
            this.Lotes_encontrados = resp;
            console.log(this.Lotes_encontrados)
            this.loading_ = false
          })
    }else{
      this.sumando = 0;
      this.Asignar = false
      this.loading_ = true
    }
  }

  BuscarUnaOrden(){
    this.api.GETORDENESPECIFICA()
      .subscribe((resp:any)=>{
        for(let i=0;i<resp.length;i++){
          this.ordenes.push(resp[i])
        }
        console.log(this.ordenes)
      })
  }

  entero(x,y){
    return Math.ceil(x/y);
  }

  Enterar(x){
    return Math.ceil(x)
  }

  seleccionar(i){
    (<HTMLInputElement>document.getElementById(i.toString())).checked
    if((<HTMLInputElement>document.getElementById(i.toString())).checked){
      this.sumando = Number(this.sumando) + Number(this.Lotes_encontrados[i].cantidad)
      this.sumando = Number(this.sumando.toFixed(2))
      this.restante[i] = '0';

      if(this.sumando>=this.Total){
        for(let x=0;x<this.Lotes_encontrados.length;x++){
          if(!(<HTMLInputElement>document.getElementById(x.toString())).checked){
            (<HTMLInputElement>document.getElementById(x.toString())).disabled = true;
          }
        }
      }else{      
        for(let x=0;x<this.Lotes_encontrados.length;x++){
          (<HTMLInputElement>document.getElementById(x.toString())).disabled = false;
        }
      }

    }else{
      this.sumando = Number(this.sumando) - Number(this.Lotes_encontrados[i].cantidad)
      this.sumando = Number(this.sumando.toFixed(2))
      this.restante[i] = null
      if(this.sumando>=this.Total){
        for(let x=0;x<this.Lotes_encontrados.length;x++){
          if(!(<HTMLInputElement>document.getElementById(x.toString())).checked){
            (<HTMLInputElement>document.getElementById(x.toString())).disabled = true;
          }
        }
      }else{      
        for(let x=0;x<this.Lotes_encontrados.length;x++){
          (<HTMLInputElement>document.getElementById(x.toString())).disabled = false;
        }
      }
    }
  }

}
