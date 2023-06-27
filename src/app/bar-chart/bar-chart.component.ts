import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';

import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { SubirArchivosService } from '../services/subir-archivos.service';
import { environment } from 'src/environments/environment';
import { Cell, Img, PdfMakeWrapper, Stack, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";


// const consultaDolar = require('consulta-dolar-venezuela');

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor(private api:RestApiService,
    private route:ActivatedRoute) {
   }
  
  ngOnInit(): void {

  }

  public muestras = 2;
  public ancho = 12.5;
  public largo = 12.5;
  public promedio = 0
  public desviacion = 0
  public inicial = []
  public final = []
  public gramaje = []
  public material = []
  public cantidades = []
  public paletas = []


  calcular_gramaje(i){
    this.gramaje[i] = (this.inicial[i]/(this.ancho*this.largo))*10000
    this.promedio = 0;
    let varianza = 0
    for(let i =0;i<this.muestras;i++){
      this.promedio = Number(this.promedio) + Number(this.gramaje[i].toFixed(2))
      if(i === this.muestras-1){
        this.promedio = this.promedio / this.muestras
        for(let x =0;x<this.muestras;x++){
          let dato = Number(this.gramaje[x]) - Number(this.promedio)
          dato = Math.pow(dato, 2)
          varianza = varianza + Number(dato)
          if(x === this.muestras -1){
            varianza = varianza / this.muestras-1
            console.log(varianza)
            this.desviacion = Math.sqrt(varianza)
          }
        }

      }
    }
  }

  buscarLote(e){
    this.api.getAlmacenadoPorLote(e)
      .subscribe((resp:any)=>{
        this.material = resp
        for(let i=0;i<this.material.length;i++){
          let index = this.cantidades.indexOf(this.material[i].cantidad)
          console.log(this.material[i].cantidad,'-',i)
          if(index < 0){
            this.cantidades.push(this.material[i].cantidad)
          }else{
            if(!this.paletas[index]){
              this.paletas[index] = 1
            }else{
              this.paletas[index] = this.paletas[index] + 1;
            }
          }
        }

        for(let i=0;i<this.paletas.length;i++){
          console.log(`${this.paletas[i]} paletas de ${this.cantidades[i]};`)
        }
      })
  }

  
}

