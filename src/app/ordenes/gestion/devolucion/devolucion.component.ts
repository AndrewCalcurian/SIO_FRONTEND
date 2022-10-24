import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { from } from 'rxjs';
import { UnicosPipe } from 'src/app/pipe/unicos.pipe';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-devolucion',
  templateUrl: './devolucion.component.html',
  styleUrls: ['./devolucion.component.css']
})
export class DevolucionComponent implements OnInit {

  @Input() devolucion:any
  @Output() onCloseModal = new EventEmitter();

  public devoluciones
  public materiales
  public repeticion = [];
  public Data_devolucion = [];
  public usuario;

  constructor(private api:RestApiService) {
    this.usuario = api.usuario
  }

  ngOnInit(): void {
    this.api.getLotes()
      .subscribe((resp:any)=>{
        this.devoluciones = resp;
        for(let i = 0; i< resp.length; i++){
            this.repeticion.push(resp[i].orden)
            let final = resp.length - 1
            if(i == final){
              const dataArr = new Set(this.repeticion);
              let result = [...dataArr];
              this.repeticion = result;
            }
        }
        
      })
  }

  seleccionarMateriales(){
  let orden_ = (<HTMLInputElement>document.getElementById('ordens')).value
  this.materiales = this.devoluciones.filter(devoluciones => devoluciones.orden === orden_);
  // this.materiales = this.materiales.material
  
  }

  onClose(){
    this.devolucion = false;
    this.onCloseModal.emit();
  }

  finalizarDevolucion(id,motivo){

    if(motivo.value.length < 1){
      let id_ = String(id)
      document.getElementById(id_).focus();
      document.getElementById(`${id_}_error`).style.display = "block";
      return
    }

    let filtrado = this.Data_devolucion.filter(x => x.id === id && x.cantidad > 0)
    let orden = (<HTMLInputElement>document.getElementById('ordens')).value
    let data = {
      orden,
      filtrado,
      motivo:motivo.value,
      usuario:`${this.usuario.Nombre} ${this.usuario.Apellido}`
    }

    this.api.postDevolucion(data)
      .subscribe((resp:any)=>{
        Swal.fire({
          title:'Devolución',
          text: 'Se realizó la devolución de materiales',
          icon:'success',
          timer:3000,
          showConfirmButton:false
        }),
        (<HTMLInputElement>document.getElementById('ordens')).value = "·"
        this.onClose();
      })

  }

  agregarMaterial(id, cantidad, material,lote,codigo){
    
    let data = 
    {
      id,
      material,
      lote,
      codigo,
      cantidad:cantidad.value
    }

    let index = this.Data_devolucion.findIndex(x => x.id === id && x.material === material)

    if(index == -1 ){
      this.Data_devolucion.push(data);
    }else{
      this.Data_devolucion[index] = data
    }

    // console.log(this.Data_devolucion)

  }

}
