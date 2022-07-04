import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit {

  @Input() confirmacion:any
  @Output() onCloseModal = new EventEmitter();
  @Output() onReset = new EventEmitter();

  constructor(private api:RestApiService) { }

  public Pendiente

  ngOnInit(): void {
    this.buscarPendientes();
  }

  buscarPendientes(){
    this.api.getRequiEspera()
      .subscribe((resp:any)=>{
        this.Pendiente = resp;
      })
  }

  mostrar(){
    this.confirmacion = true;
    console.log(this.Pendiente)
  }

  onClose(){
    this.confirmacion = false;
    this.onCloseModal.emit();
  }

  aprobar(id:any){
    Swal.fire({
      title: '¿Aprobar Solicitud?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Aprobar!',
      cancelButtonText:'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.UpdateRequi(id)
          .subscribe((resp:any)=>{
            this.buscarPendientes();
            this.onReset.emit()
          })
        Swal.fire(
      {
        showConfirmButton:false,
        title:'Aprobado!',
        text:'La solicitud fue aprobada',
        icon:'success'
      }
          )

      }
    })
  }

  rechazar(id:any){
    Swal.fire({
  title: '¿Rechazar Solicitud?',
  text: "No podrás revertir esto!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sí, Rechazar!',
  cancelButtonText:'Cancelar'
}).then((result) => {
  if (result.isConfirmed) {
    this.api.DeleteRequi(id)
      .subscribe((resp:any)=>{
        this.buscarPendientes();
        this.onReset.emit()
      })
    Swal.fire(
      {
        showConfirmButton:false,
        title:'Rechazado!',
        text:'La solicitud fue rechazada',
        icon:'error'
      }
    )
  }
})
  }

}
