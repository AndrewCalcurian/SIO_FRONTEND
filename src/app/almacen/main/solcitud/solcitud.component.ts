import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-solcitud',
  templateUrl: './solcitud.component.html',
  styleUrls: ['./solcitud.component.css']
})
export class SolcitudComponent implements OnInit {
  
  public materiales:any;



  @Input() solicitud:any
  @Input() orden:any
  @Output() onCloseModal = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  TraerMateriales(e){
    let Orden_seleccionada = this.orden.find(x => x.sort == e)
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

}
