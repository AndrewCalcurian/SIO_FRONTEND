import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solcitud',
  templateUrl: './solcitud.component.html',
  styleUrls: ['./solcitud.component.css']
})
export class SolcitudComponent implements OnInit {
  
  public materiales:any;
  public orden_selected;
  public Otro:boolean = false;
  public grupos;
  public almacenado
  public por_confirmar = []
  public _materiales = []



  @Input() solicitud:any
  @Input() orden:any
  @Output() onCloseModal = new EventEmitter();

  constructor(private api:RestApiService) {

    let usuario = api.usuario
   }

  ngOnInit(): void {
  }

  getGRupos(){
    this.api.GetGrupoMp()
      .subscribe((resp:any)=>{
        this.grupos = resp;
        // console.log(this.grupos)
      })
  }

  quitarMaterial(i){
    this.por_confirmar.splice(i)
    this._materiales.splice(i)
  }

  cambiarCantidades(i,e){
    this._materiales[i].cantidad = e;
    // console.log(this._materiales)
  }

  AdjuntarMaterial(e){
    let almacen = this.almacenado.find(x => x.material._id === e)
    this.por_confirmar.push(almacen)
    let mat = this._materiales.push({
      producto:almacen.material._id,
      cantidad:0
    })
    // console.log(this._materiales)
  }

  mostrarMaterial(e){
    if(e === "#"){
    (<HTMLInputElement>document.getElementById('_material_')).disabled = true
    }else{
      this.api.getAlmacenado()
        .subscribe((resp:any)=>{
          (<HTMLInputElement>document.getElementById('_material_')).disabled = false
          this.almacenado = resp.filter(x => x.material.grupo._id === e)
          if(e != '61f92a1f2126d717f004cca6'){
            this.almacenado = [...this.almacenado.reduce((map, obj) => map.set(obj.material.nombre, obj), new Map()).values()];
          }
        })
    }
  }

  TraerMateriales(e){

    // console.log(e)

    if(e === 'Otro'){
      this.Otro = true;
      this.getGRupos();
    }else{
      let Orden_seleccionada = this.orden.find(x => x.sort == e)
      this.orden_selected = Orden_seleccionada
      this.Otro = false;
      if(Orden_seleccionada){
        this.materiales = Orden_seleccionada.producto.materiales[Orden_seleccionada.montaje]
      }else{
        this.materiales = undefined;
      }
    }
  }

  onClose(){
    this.solicitud = false;
    this.onCloseModal.emit();
  }

  FinalizarSolicitu(){
    let requisicion = {
      sort:'#',
      motivo:(<HTMLInputElement>document.getElementById('_motivo')).value,
      usuario:`${this.api.usuario.Nombre} ${this.api.usuario.Apellido}`,
      producto:{
        materiales:[[]]
      }
    }

    requisicion.producto.materiales[0] = this._materiales

    // console.log(requisicion)

    this.api.postReq(requisicion)
     .subscribe((resp:any)=>{
       Swal.fire(
         {
           showConfirmButton:false,
           title:'Hecho!',
          text:'Se realizó la solicitud correctamente',
           icon:'success',
           timer:5000
         }
       )
       this._materiales = []
       this.onClose()
     })

  }

  FinalizarSolicitud(){

    let iteration = 0

    let requisicion = {
      sort:this.orden_selected.sort,
      motivo:(<HTMLInputElement>document.getElementById('razon')).value,
      usuario:`${this.api.usuario.Nombre} ${this.api.usuario.Apellido}`,
      producto:{
        materiales:[[]]
      }
    }

  for(let i=0;i<this.materiales.length;i++){
    let _i = i.toString();

    let cantidad = (<HTMLInputElement>document.getElementById(_i)).value;
    let producto = (<HTMLInputElement>document.getElementById(_i)).name;

    let num = Number(cantidad)

    if(num > 0){

      iteration++
      requisicion.producto.materiales[0].push({
        cantidad,
        producto 
      })
    }


    // console.log(requisicion)


  }

  if(iteration>0){

    this.api.postReq(requisicion)
    .subscribe((resp:any)=>{
      Swal.fire(
        {
          showConfirmButton:false,
          title:'Hecho!',
          text:'Se realizó la solicitud correctamente',
          icon:'success',
          timer:5000
        }
      )
      this.onClose()
    })
    
  }else{
    Swal.fire(
      {
        showConfirmButton:false,
        title:'Error!',
        text:'Debe ingresar al menos una cantidad de cualquier producto',
        icon:'error'
      }
    )

    return
  }

  
  
  
}


}
