import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SubirArchivosService } from 'src/app/services/subir-archivos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-repuesto',
  templateUrl: './registro-repuesto.component.html',
  styleUrls: ['./registro-repuesto.component.css']
})
export class RegistroRepuestoComponent implements OnInit {

  constructor(private api:RestApiService,
              private upload:SubirArchivosService) { }

  @Input() Maquinas:any;
  @Input() Categorias:any;
  @Input() Repuesto:any;
  @Input() nuevoMaterial:any;
  @Input() Edicion:boolean;
  @Output() onCloseModal = new EventEmitter();

  ngOnInit(): void {
  }

  SubirFoto(e){
    let image = (e.target).files[0]
    this.upload.actualizarFoto(image,'repuestos','id')
      .then(img =>{
        console.log(img)
        this.nuevoMaterial.foto = img;
      })
  }

  editar(){
    this.api.putRepuesto(this.nuevoMaterial, this.nuevoMaterial._id)
      .subscribe((resp:any)=>{
        console.log(resp)
        this.cerrar();
      })
  }

  guardar(){
    this.api.postRepuesto(this.nuevoMaterial)
        .subscribe((resp:any)=>{
          if(resp.error){
            Swal.fire({
              title:resp.error.mensaje,
              showConfirmButton:false,
              icon:'warning',
              timerProgressBar:true,
              timer:2500
            })
            return
          }
          this.cerrar()
          
        })
  }


  cerrar(){
    this.onCloseModal.emit()
  }

}
