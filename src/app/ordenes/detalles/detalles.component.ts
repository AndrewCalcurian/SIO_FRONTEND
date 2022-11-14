import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { zip } from 'rxjs';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {

  @Input() detalle:any
  @Input() orden_detalle:any
  @Input() orden_id:any
  @Input() cantidad_d:any
  @Input() cantidad_do:any
  @Output() onCloseModal = new EventEmitter();
  @Output() CargarOrdenes = new EventEmitter();

  public trabajos;
  public gestiones_;
  public cargando:boolean = true;
  public detallado:boolean = false;
  public despachos = [];
  public despacho = 0;
  public usuario;
  public Maquinas;

  constructor(private api:RestApiService) {
    this.usuario = api.usuario;
   }

  ngOnInit(): void {
  }

  cambiarFecha(dato, trabajo, campo:string){
    this.api.updateTrabajo(trabajo, {[campo]:dato})
      .subscribe((resp:any)=>{

      })
  }

  format(n){
    return Math.ceil(n);
  }

  gestiones(){
    this.detallado = true;
    this.buscarTrabajos();
    this.buscarGestiones();
    this.buscarDespachos();
    this.BuscarMaquinas();
  }

  restan(a,b){
    let c = a -b;
    if(c < 0){
      return 0
    }else{
      return c
    }

  }

  cerrarOrden(){
    Swal.fire({
      title: '¿Cerrar orden de producción?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Cerrar',
      denyButtonText: `No cerrar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.CerrarOrden(this.orden_id)
          .subscribe((resp:any)=>{
            this.CargarOrdenes.emit();
            this.onClose()
            Swal.fire('¡Cerrada!', '', 'success')
          })
      } else if (result.isDenied) {
        Swal.fire('La orden no fué cerrada', '', 'info')
      }
    })
    // console.log(this.orden_id)
  }

  buscarDespachos(){
    this.api.GetDespachoByOrden(this.orden_detalle)
      .subscribe((resp:any)=>{
        for(let i=0; i<resp.length; i++){
          for(let y=0; y<resp[i].despacho.length; y++){

            if(resp[i].despacho[y].op === this.orden_detalle)
            {
              this.despachos.push(resp[i].despacho[y])
              this.despachos.push({fecha:resp[i].fecha})
              this.despacho = this.despacho + resp[i].despacho[y].cantidad
              // console.log(this.despachos)
            }
          }
        }
      })
  }

  buscarGestiones(){
    this.api.getGestiones()
      .subscribe((resp:any)=>{
        this.gestiones_ = resp;
      })
  }

  CambioDeMaquina(e){
    alert(e)
  }

  buscarTrabajos(){
    this.api.getMaquinasByOrdens(this.orden_id)
      .subscribe((resp:any)=>{
        this.trabajos = resp.maquinasDB;
        // this.trabajos = this.trabajos.sort(x => x.fechaI)
      })
  }

  BuscarMaquinas(){
    this.api.GetMaquinas()
      .subscribe((resp:any)=>{
        this.Maquinas = resp

        console.log(this.Maquinas)
      })
  }

  onClose(){
    this.detalle = false;
    this.detallado = false;
    this.despachos = [];
    this.despacho = 0;
    this.onCloseModal.emit();
  }

}
