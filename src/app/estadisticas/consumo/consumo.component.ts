import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.css']
})
export class ConsumoComponent implements OnInit {

  @Input() modal_consumos:any
  @Input() c_lotes:any
  @Input() lote_mayor:any

  @Output() onCloseModal = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  closemodal(){
    this.onCloseModal.emit();
  }

}
