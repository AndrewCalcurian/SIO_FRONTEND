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



  @Input() solicitud:any
  @Input() orden:any
  @Output() onCloseModal = new EventEmitter();

  constructor(private api:RestApiService) {

    let usuario = api.usuario
   }

  ngOnInit(): void {
  }

  TraerMateriales(e){
    let Orden_seleccionada = this.orden.find(x => x.sort == e)
    this.orden_selected = Orden_seleccionada
    if(Orden_seleccionada){
      this.materiales = Orden_seleccionada.producto.materiales[Orden_seleccionada.montaje]
    }else{
      this.materiales = undefined;
    }
  }

  onClose(){
    this.solicitud = false;
    this.onCloseModal.emit();
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


    console.log(requisicion)


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
