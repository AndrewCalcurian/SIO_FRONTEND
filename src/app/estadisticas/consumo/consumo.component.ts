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
  @Input() c_devoluciones:any

  @Output() onCloseModal = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  closemodal(){
    this.onCloseModal.emit();
  }

  public devoluc = []
  devoluciones_(id,op){
  let data = 0;
  let x = 0
  let y = 0
    for(let i=0;i<this.c_devoluciones.length;i++){
      x++
      y = 0
      let len = this.c_devoluciones[i].filtrado
      for(let n=0;n<len.length;n++){
        y++;
        if(this.c_devoluciones[i].filtrado[n].material == id){
          data = data + this.c_devoluciones[i].filtrado[n].cantidad;
          // console.log(this.c_devoluciones[i].filtrado[n])
        }
        if(x == this.c_devoluciones.length && y == len.length){
          if(data > 0){
            return data.toFixed(2);
          }else{
            return data
          }
        }
      }
    }

    // let dev_filtered = this.c_devoluciones.filter(x=> x.filtrado.material === id)
    // console.log(dev_filtered)
    // if(dev_filtered.length > 0){
    //   return '150'
    // }else{
    //   return '0'
    // }

    // for(let i=0;i<this.c_devoluciones.length;i++){
    //   let len = this.c_devoluciones[i].filtrado
    //   for(let n=0;n<len.length;n++){
    //     if(this.c_devoluciones[i].filtrado[n].material === id){
    //       let duplicado = this.devoluc.find(x => x.material == id);
    //       if(duplicado){
    //         let index_ = this.devoluc.findIndex(x=> x.material == id) 
    //         this.devoluc[index_].cantidad = this.devoluc[index_].cantidad + this.c_devoluciones[i].filtrado[n].cantidad
    //       }else{
    //         this.devoluc.push({material:id, cantidad:this.c_devoluciones[i].filtrado[n].cantidad})
    //       }
    //     }
    //   }
    // }
  }

  dec(n){
    return Number(n).toFixed(2)
  }

}
