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
      title: '¿Aprobar Requisición?',
      text: "No podras revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Apronar!',
      cancelButtonText:'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.UpdateRequi(id)
          .subscribe((resp:any)=>{
            this.buscarPendientes();
          })
        Swal.fire(
          'Aprobado!',
          'La requisición fue aprobada',
          'success'
        )
      }
    })
  }

  rechazar(id:any){
    Swal.fire({
  title: '¿Rechazar Requisición?',
  text: "No podras revertir esto!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, Rechazar!',
  cancelButtonText:'Cancelar'
}).then((result) => {
  if (result.isConfirmed) {
    this.api.DeleteRequi(id)
      .subscribe((resp:any)=>{
        this.buscarPendientes();
      })
    Swal.fire(
      'Rechazado!',
      'La requisición fue rechazada',
      'success'
    )
  }
})
  }

}
