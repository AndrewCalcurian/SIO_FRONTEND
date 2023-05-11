import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';


import { NgxQrcodeElementTypes} from '@techiediaries/ngx-qrcode';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

// const consultaDolar = require('consulta-dolar-venezuela');

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor(private api:RestApiService,
    private route:ActivatedRoute) {

    this.id = this.route.snapshot.paramMap.get('id');
   }


  public id!:any ;
  public orden;
  public fecha;
  public sustrato;
  public hoy;
  public cantidad;



  elementType = NgxQrcodeElementTypes.CANVAS;
  margin = 1
  scale = 2
  value;
  
  ngOnInit(): void {
    // consultaDolar.$monitor().then($=>{console.log($)})
    // console.log('default printer name: ' + (ZebraBrowserPrintWrapper.getAvailablePrinters() || 'is not defined on your computer'));
    
    this.api.getOrdenById2(this.id)
    .subscribe((resp:any)=>{
      this.orden = resp.ordenes;
      this.fecha = resp.trabajos;
      this.hoy = moment.utc().format('DD/MM/yyyy');
      for(let i=0;i<this.orden.producto.materiales[this.orden.montaje].length;i++){
        if(this.orden.producto.materiales[this.orden.montaje][i].producto.ancho){
          this.sustrato = `${this.orden.producto.materiales[this.orden.montaje][i].producto.nombre}, Cal ${this.orden.producto.materiales[this.orden.montaje][i].producto.calibre}, Gramaje ${this.orden.producto.materiales[this.orden.montaje][i].producto.gramaje}`
        }else if(this.orden.producto.materiales[this.orden.montaje][i].producto.grupo.nombre === 'Cajas Corrugadas'){
          // console.log(this.orden.producto.materiales[this.orden.montaje][i])
          this.cantidad = this.orden.producto.materiales[this.orden.montaje][i].cantidad
        }
      }
      this.value = `${this.orden.producto.producto}\nOP: ${this.orden.sort}\nOC: ${this.orden.orden}\n${this.cantidad} Und.`
      })
  }

  crearqr(){
    
  }


  onPrint(){

    window.resizeTo(900, 600)
    var printButton = document.getElementById("imprimir__");
    //Set the print button visibility to 'hidden'
    printButton.style.height = '0px';
    printButton.style.visibility = 'hidden';
    window.print()
    printButton.style.visibility = 'visible';
    printButton.style.height = '40px';

  }


}

