import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';

import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { SubirArchivosService } from '../services/subir-archivos.service';
import { environment } from 'src/environments/environment';
import { Cell, Img, PdfMakeWrapper, Stack, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { timer } from 'rxjs';
import { layouts } from 'chart.js';


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


    let number = 0.002
    console.log(parseFloat(number.toPrecision()))


  }

  public _gramaje:boolean = true;
  public _calibre:boolean = false;
  public _blancura:boolean = false;
  public _dimensiones:boolean = false;

  public muestras = 0;
  public ancho = 0;
  public largo = 0;
  public promedio = 0
  public desviacion = 0;
  public max_gramaje = 0;
  public min_gramaje = 0;
  public inicial = []
  public final = []
  public gramaje = []
  public cobb = []
  public material = []
  public cantidades = []
  public paletas = []


  public promedio_cobb_top = 0
  public promedio_cobb_back = 0
  public max_cobb_top = 0;
  public max_cobb_bac = 0;
  public min_cobb_top = 0;
  public min_cobb_bac = 0;

  public desviacion_cobb_top = 0
  public desviacion_cobb_back = 0

  public calibre = []
  public Um_calibre = []
  public pt_calibre = []
  public promedio_calibre = 0
  public desviacion_calibre = 0
  public promedio_calibre_um = 0
  public desviacion_calibre_um = 0
  public promedio_calibre_pt = 0
  public desviacion_calibre_pt = 0
  public promedio_curling = 0;
  public desviacion_curling = 0;
  public promedio_blancura = 0;
  public desviacion_blancura = 0;
  public promedio_escuadra = 0;
  public desviacion_escuadra = 0;
  public promedio_contra_escuadra = 0;
  public desviacion_contra_escuadra = 0;
  public promedio_pinza = 0;
  public desviacion_pinza = 0;
  public promedio_contra_pinza = 0;
  public desviacion_contra_pinza = 0;

  public max_calibre = 0
  public min_calibre = 0
  public max_calibre_um = 0
  public min_calibre_um = 0
  public max_calibre_pt = 0
  public min_calibre_pt = 0
  public max_curling = 0
  public min_curling = 0
  public max_blancura = 0;
  public min_blancura = 0;
  public max_escuadra = 0;
  public min_escuadra = 0;
  public max_contra_escuadra = 0;
  public min_contra_escuadra = 0;
  public max_pinza = 0;
  public min_pinza = 0;
  public max_contra_pinza = 0;
  public min_contra_pinza = 0;

  public Calibre_nf = 0;
  public Gramaje_nf = 0;

  public Calibre_nf_um = 0;
  public Calibre_nf_pt = 0;
  public curling_nf = 0;
  public blancura_nf = 0;
  public escuadra_nf = 0;
  public contra_escuadra_nf = 0;
  public pinza_nf = 0;
  public contra_pinza_nf = 0;


  public curling = []
  public blancura = []
  public escuadra = []
  public contra_escuadra = []
  public pinza = []
  public contra_pinza = []


  public tablas:boolean = false;

  showTables(){
    if(!this.tablas){
      this.tablas = true
    }
  }

  
  calcular_curling(i){
    this.promedio_curling = 0;
    let varianza_curling = 0
    for(let i =0;i<this.muestras;i++){
      this.promedio_curling = this.promedio_curling + Number(this.curling[i].toFixed(2))
      this.promedio_curling = Number(this.promedio_curling.toFixed(3))
      if(i === this.muestras-1){
        this.promedio_curling = this.promedio_curling / this.muestras
        for(let x =0;x<this.muestras;x++){
          let rango = Math.pow(this.curling[x].toFixed(2) - this.promedio_curling, 2);
          rango = Number(rango.toFixed(4))
          varianza_curling = varianza_curling + rango
          if(x === this.muestras -1){
            varianza_curling = varianza_curling / (this.muestras-1)
            this.desviacion_curling = Math.sqrt(varianza_curling)
            if(this.desviacion_curling > 0){
              this.curling_nf = 0
            }
            if(this.desviacion_curling < 1){
              let str = this.desviacion_curling.toString()
              let split = str.split('.')
              let decimales = split[1]

              for(let i=0;i<decimales.length;i++){
                if(decimales[i] != '0'){
                  this.curling_nf = Number(i)
                  this.curling_nf = this.curling_nf + 1;
                  i = 100;
                }
              }
            }
            this.max_curling = Math.max(...this.curling)
            this.max_curling = Number(this.max_curling.toFixed(2))
            this.min_curling = Math.min(...this.curling)
            this.min_curling = Number(this.min_curling.toFixed(2))
          }
        }

      }
    }
  }

  calcular_blancura(i){
    this.promedio_blancura = 0;
    let varianza_blancura = 0
    for(let i =0;i<this.muestras;i++){
      this.promedio_blancura = this.promedio_blancura + Number(this.blancura[i].toFixed(2))
      this.promedio_blancura = Number(this.promedio_blancura.toFixed(3))
      if(i === this.muestras-1){
        this.promedio_blancura = this.promedio_blancura / this.muestras
        for(let x =0;x<this.muestras;x++){
          let rango = Math.pow(this.blancura[x].toFixed(2) - this.promedio_blancura, 2);
          rango = Number(rango.toFixed(4))
          varianza_blancura = varianza_blancura + rango
          if(x === this.muestras -1){
            varianza_blancura = varianza_blancura / (this.muestras-1)
            this.desviacion_blancura = Math.sqrt(varianza_blancura)
            if(this.desviacion_blancura > 0){
              this.blancura_nf = 0
            }
            if(this.desviacion_blancura < 1){
              let str = this.desviacion_blancura.toString()
              let split = str.split('.')
              let decimales = split[1]

              for(let i=0;i<decimales.length;i++){
                if(decimales[i] != '0'){
                  this.blancura_nf = Number(i)
                  this.blancura_nf = this.blancura_nf + 1;
                  i = 100;
                }
              }
            }
            this.max_blancura = Math.max(...this.blancura)
            this.max_blancura = Number(this.max_blancura.toFixed(2))
            this.min_blancura = Math.min(...this.blancura)
            this.min_blancura = Number(this.min_blancura.toFixed(2))
          }
        }

      }
    }
  }

  calcular_calibre(i){
    this.promedio_calibre = 0
    this.promedio_calibre_um = 0;
    this.promedio_calibre_pt = 0;
    let varianza = 0
    let varianza_um = 0
    let varianza_pt = 0
    this.Um_calibre[i] = this.calibre[i]*1000
    this.pt_calibre[i] = (this.calibre[i]/0.0254).toFixed(2)
    for(let i =0;i<this.muestras;i++){
      this.promedio_calibre = this.promedio_calibre + Number(this.calibre[i])
      this.promedio_calibre = Number(this.promedio_calibre)

      this.promedio_calibre_um = this.promedio_calibre_um + Number(this.Um_calibre[i])
      this.promedio_calibre_um = Number(this.promedio_calibre_um)

      this.promedio_calibre_pt = this.promedio_calibre_pt + Number(this.pt_calibre[i])
      this.promedio_calibre_pt = Number(this.promedio_calibre_pt)

      if(i === this.muestras-1){
        this.promedio_calibre = this.promedio_calibre / this.muestras
        this.promedio_calibre_um = this.promedio_calibre_um / this.muestras
        this.promedio_calibre_pt = this.promedio_calibre_pt / this.muestras

        for(let x =0;x<this.muestras;x++){
          let rango = Math.pow(this.calibre[x].toFixed(2) - this.promedio_calibre, 2);
          rango = Number(rango)
          varianza = varianza + rango

          let rango_um = Math.pow(this.Um_calibre[x].toFixed(2) - this.promedio_calibre_um, 2);
          rango_um = Number(rango_um)
          varianza_um = varianza_um + rango_um

          let rango_pt = Math.pow(Number(this.pt_calibre[x]) - this.promedio_calibre_pt, 2);
          rango_pt = Number(rango_pt)
          varianza_pt = varianza_pt + rango_pt

          if(x === this.muestras -1){
            varianza = varianza / (this.muestras-1)
            varianza_um = varianza_um / (this.muestras-1)
            varianza_pt = varianza_pt / (this.muestras-1)
            this.desviacion_calibre = Math.sqrt(varianza)
            this.desviacion_calibre_um = Math.sqrt(varianza_um)
            this.desviacion_calibre_pt = Math.sqrt(varianza_pt)
            this.desviacion_calibre = Number(this.desviacion_calibre)
            this.desviacion_calibre_um = Number(this.desviacion_calibre_um)
            this.desviacion_calibre_pt = Number(this.desviacion_calibre_pt)
            if(this.desviacion_calibre < 1){
              let str = this.desviacion_calibre.toString()
              let split = str.split('.')
              let decimales = split[1]

              for(let i=0;i<decimales.length;i++){
                if(decimales[i] != '0'){
                  this.Calibre_nf = Number(i)
                  this.Calibre_nf = this.Calibre_nf + 1;
                  i = 100;
                }
              }
            }

            if(this.desviacion_calibre_um < 1){
              let str = this.desviacion_calibre_um.toString()
              let split = str.split('.')
              let decimales = split[1]
              for(let i=0;i<decimales.length;i++){
                if(decimales[i] != '0'){
                  this.Calibre_nf_um = Number(i)
                  this.Calibre_nf_um = this.Calibre_nf_um + 1;
                  i = 100;
                }
              }
            }

            if(this.desviacion_calibre_pt < 1){
              let str = this.desviacion_calibre_pt.toString()
              let split = str.split('.')
              let decimales = split[1]

              for(let i=0;i<decimales.length;i++){
                if(decimales[i] != '0'){
                  this.Calibre_nf_pt = Number(i)
                  this.Calibre_nf_pt = this.Calibre_nf_pt + 1;
                  i = 100;
                }
              }
            }
            
            this.max_calibre = Math.max(...this.calibre)
            this.max_calibre = Number(this.max_calibre.toFixed(2))
            this.min_calibre = Math.min(...this.calibre)
            this.min_calibre = Number(this.min_calibre.toFixed(2))

            this.max_calibre_um = Math.max(...this.Um_calibre)
            this.max_calibre_um = Number(this.max_calibre_um.toFixed(2))
            this.min_calibre_um = Math.min(...this.Um_calibre)
            this.min_calibre_um = Number(this.min_calibre_um.toFixed(2))

            this.max_calibre_pt = Math.max(...this.pt_calibre)
            this.max_calibre_pt = Number(this.max_calibre_pt.toFixed(2))
            this.min_calibre_pt = Math.min(...this.pt_calibre)
            this.min_calibre_pt = Number(this.min_calibre_pt.toFixed(2))

          }
        }
      }
    }
  }


  calcular_escuadra(i){
    this.promedio_escuadra = 0;
    let varianza = 0
    for(let i =0;i<this.muestras;i++){
      this.promedio_escuadra = Number(this.promedio_escuadra) + Number(this.escuadra[i])
      if(i === this.muestras-1){
        this.promedio_escuadra = this.promedio_escuadra / this.muestras;
        for(let x =0;x<this.muestras;x++){
          let rango = Math.pow(this.escuadra[x] - this.promedio_escuadra, 2);
          rango = Number(rango.toFixed(4))
          varianza = varianza + rango
          if(x === this.muestras -1){
            varianza = varianza / (this.muestras-1)
            this.desviacion_escuadra = Math.sqrt(varianza)
            if(this.desviacion_escuadra > 0){
              this.escuadra_nf = 0
            }
            if(this.desviacion_escuadra < 1){
              let str = this.desviacion_escuadra.toString()
              let split = str.split('.')
              let decimales = split[1]

              for(let i=0;i<decimales.length;i++){
                if(decimales[i] != '0'){
                  this.escuadra_nf = Number(i)
                  this.escuadra_nf = this.escuadra_nf + 1;
                  i = 100;
                }
              }
            }
            this.max_escuadra = Math.max(...this.escuadra)
            this.max_escuadra = Number(this.max_escuadra.toFixed(2))
            this.min_escuadra = Math.min(...this.escuadra)
            this.min_escuadra = Number(this.min_escuadra.toFixed(2))
          }
        }
      }
    }

  }

  calcular_contra_escuadra(i){
    console.log('hierro')
    this.promedio_contra_escuadra = 0;
    let varianza = 0
    for(let i =0;i<this.muestras;i++){
      this.promedio_contra_escuadra = Number(this.promedio_contra_escuadra) + Number(this.contra_escuadra[i])
      if(i === this.muestras-1){
        this.promedio_contra_escuadra = this.promedio_contra_escuadra / this.muestras;
        for(let x =0;x<this.muestras;x++){
          let rango = Math.pow(this.contra_escuadra[x] - this.promedio_contra_escuadra, 2);
          rango = Number(rango.toFixed(4))
          varianza = varianza + rango
          if(x === this.muestras -1){
            varianza = varianza / (this.muestras-1)
            this.desviacion_contra_escuadra = Math.sqrt(varianza)
            console.log(this.desviacion_contra_escuadra, '/', this.promedio_contra_escuadra )
            if(this.desviacion_contra_escuadra > 0){
              this.contra_escuadra_nf = 0
            }
            if(this.desviacion_contra_escuadra < 1){
              let str = this.desviacion_contra_escuadra.toString()
              let split = str.split('.')
              let decimales = split[1]

              for(let i=0;i<decimales.length;i++){
                if(decimales[i] != '0'){
                  this.contra_escuadra_nf = Number(i)
                  this.contra_escuadra_nf = this.contra_escuadra_nf + 1;
                  i = 100;
                }
              }
            }
            this.max_contra_escuadra = Math.max(...this.contra_escuadra)
            this.max_contra_escuadra = Number(this.max_contra_escuadra.toFixed(2))
            this.min_contra_escuadra = Math.min(...this.contra_escuadra)
            this.min_contra_escuadra = Number(this.min_contra_escuadra.toFixed(2))
          }
        }
      }
    }
  }

  calcular_pinza(i){
    this.promedio_pinza = 0;
    let varianza = 0
    for(let i =0;i<this.muestras;i++){
      this.promedio_pinza = Number(this.promedio_pinza) + Number(this.pinza[i])
      if(i === this.muestras-1){
        this.promedio_pinza = this.promedio_pinza / this.muestras;
        for(let x =0;x<this.muestras;x++){
          let rango = Math.pow(this.pinza[x] - this.promedio_pinza, 2);
          rango = Number(rango.toFixed(4))
          varianza = varianza + rango
          if(x === this.muestras -1){
            varianza = varianza / (this.muestras-1)
            this.desviacion_pinza = Math.sqrt(varianza)
            if(this.desviacion_pinza > 0){
              this.pinza_nf = 0
            }
            if(this.desviacion_pinza < 1){
              let str = this.desviacion_pinza.toString()
              let split = str.split('.')
              let decimales = split[1]

              for(let i=0;i<decimales.length;i++){
                if(decimales[i] != '0'){
                  this.pinza_nf = Number(i)
                  this.pinza_nf = this.pinza_nf + 1;
                  i = 100;
                }
              }
            }
            this.max_pinza = Math.max(...this.pinza)
            this.max_pinza = Number(this.max_pinza.toFixed(2))
            this.min_pinza = Math.min(...this.pinza)
            this.min_pinza = Number(this.min_pinza.toFixed(2))
          }
        }
      }
    }
  }

  calcular_contra_pinza(i){
    this.promedio_contra_pinza = 0;
    let varianza = 0
    for(let i =0;i<this.muestras;i++){
      this.promedio_contra_pinza = Number(this.promedio_contra_pinza) + Number(this.contra_pinza[i])
      if(i === this.muestras-1){
        this.promedio_contra_pinza = this.promedio_contra_pinza / this.muestras;
        for(let x =0;x<this.muestras;x++){
          let rango = Math.pow(this.contra_pinza[x] - this.promedio_contra_pinza, 2);
          rango = Number(rango.toFixed(4))
          varianza = varianza + rango
          if(x === this.muestras -1){
            varianza = varianza / (this.muestras-1)
            this.promedio_contra_pinza = Math.sqrt(varianza)
            if(this.promedio_contra_pinza > 0){
              this.contra_pinza_nf = 0
            }
            if(this.promedio_contra_pinza < 1){
              let str = this.promedio_contra_pinza.toString()
              let split = str.split('.')
              let decimales = split[1]

              for(let i=0;i<decimales.length;i++){
                if(decimales[i] != '0'){
                  this.contra_pinza_nf = Number(i)
                  this.contra_pinza_nf = this.contra_pinza_nf + 1;
                  i = 100;
                }
              }
            }
            this.max_contra_pinza = Math.max(...this.contra_pinza)
            this.max_contra_pinza = Number(this.max_contra_pinza.toFixed(2))
            this.min_contra_pinza = Math.min(...this.contra_pinza)
            this.min_contra_pinza = Number(this.min_contra_pinza.toFixed(2))
          }
        }
      }
    }
  }


  calcular_gramaje(i){
    this.gramaje[i] = (this.inicial[i]/(this.ancho*this.largo))*10000
    this.gramaje[i] = this.gramaje[i].toFixed(2)
    this.promedio = 0;
    let varianza = 0
    for(let i =0;i<this.muestras;i++){
      this.promedio = this.promedio + Number(this.gramaje[i])
      this.promedio = Number(this.promedio.toFixed(3))
      if(i === this.muestras-1){
        this.promedio = this.promedio / this.muestras
        for(let x =0;x<this.muestras;x++){
          let rango = Math.pow(this.gramaje[x] - this.promedio, 2);
          rango = Number(rango.toFixed(4))
          varianza = varianza + rango
          if(x === this.muestras -1){
            varianza = varianza / (this.muestras-1)
            this.desviacion = Math.sqrt(varianza)
            if(this.desviacion > 0){
              this.Gramaje_nf = 0
            }
            if(this.desviacion < 1){
              let str = this.desviacion.toString()
              let split = str.split('.')
              let decimales = split[1]

              console.log(split[1])
              for(let i=0;i<decimales.length;i++){
                if(decimales[i] != '0'){
                  this.Gramaje_nf = Number(i)
                  this.Gramaje_nf = this.Gramaje_nf + 1;
                  i = 100;
                }
              }
            }
            this.max_gramaje = Math.max(...this.gramaje)
            this.max_gramaje = Number(this.max_gramaje.toFixed(2))
            this.min_gramaje = Math.min(...this.gramaje)
            this.min_gramaje = Number(this.min_gramaje.toFixed(2))
          }
        }

      }
    }
  }

  gramaje_(){
    this._gramaje = true;
    this._calibre = false;
    this._blancura = false;
    this._dimensiones = false;
  }

  calibre_(){
    this._gramaje = false;
    this._calibre = true
    this._blancura = false;
    this._dimensiones = false;
  }
  blancura_(){
    this._gramaje = false;
    this._calibre = false;
    this._blancura = true;
    this._dimensiones = false;

  }
  dimensiones_(){
    this._gramaje = false;
    this._calibre = false;
    this._blancura = false;
    this._dimensiones = true;
  }

  calcular_cobb(i){
    this.cobb[i] = (this.final[i] - this.inicial[i])
    this.cobb[i] = this.cobb[i] * 100
    this.cobb[i] = this.cobb[i].toFixed(0)
    let cobb_back = []
    let cobb_top = []

    
    let mitad = this.muestras / 2;
    
    if(i+1<=mitad){
      this.promedio_cobb_top = 0
      let varianza = 0;
      for(let i=0;i<mitad;i++){


        cobb_top.push(this.cobb[i])

        if(this.cobb[i]){

          let number = Number(this.cobb[i])
          this.promedio_cobb_top = this.promedio_cobb_top + number

        }

        if(i === mitad-1){

          this.max_cobb_top = Math.max(...cobb_top)
          this.max_cobb_top = Number(this.max_cobb_top.toFixed(2))
          this.min_cobb_top = Math.min(...cobb_top)
          this.min_cobb_top = Number(this.min_cobb_top.toFixed(2))

          this.promedio_cobb_top = this.promedio_cobb_top / mitad;
          this.promedio_cobb_top = Number(this.promedio_cobb_top.toFixed(2))

          for(let x =0;x<mitad;x++){
            let rango = Math.pow(this.cobb[x] - this.promedio_cobb_top, 2);
            rango = Number(rango.toFixed(4))
            varianza = varianza + rango

            if(x === mitad -1){
              varianza = varianza / (mitad-1)
              this.desviacion_cobb_top = Math.sqrt(varianza)
              if(this.desviacion > 0){
                this.promedio_cobb_top = Math.ceil(this.promedio_cobb_top)
                this.desviacion_cobb_top = Number(this.desviacion_cobb_top.toFixed(0))
              }
            }
          }
        }

      }

    }else{
      this.promedio_cobb_back = 0
      let varianza = 0;
      for(let i=mitad;i<this.muestras;i++){

        cobb_back.push(this.cobb[i])

        if(this.cobb[i]){
          let number = Number(this.cobb[i])
          this.promedio_cobb_back = this.promedio_cobb_back + number
          console.log(this.promedio_cobb_top,'/',number,'/',mitad)

        }

        if(i == this.muestras-1){
          this.max_cobb_bac = Math.max(...cobb_back)
          this.max_cobb_bac = Number(this.max_cobb_bac.toFixed(2))
          this.min_cobb_bac = Math.min(...cobb_back)
          this.min_cobb_bac = Number(this.min_cobb_bac.toFixed(2))

          this.promedio_cobb_back = this.promedio_cobb_back / mitad;
          this.promedio_cobb_back = Number(this.promedio_cobb_back.toFixed(2))

          for(let x =mitad;x<this.muestras;x++){
            let rango = Math.pow(this.cobb[x] - this.promedio_cobb_back, 2);
            rango = Number(rango.toFixed(4))
            varianza = varianza + rango

            if(x === this.muestras -1){
              varianza = varianza / (mitad-1)
              this.desviacion_cobb_back = Math.sqrt(varianza)
              if(this.desviacion > 0){
                this.promedio_cobb_back = Math.ceil(this.promedio_cobb_top)
                this.desviacion_cobb_back = Number(this.desviacion_cobb_back.toFixed(0))
              }
            }
          }
        }
      }

    }


  }

  Finalizar_Sustrato(){
    // let certificado = {
    //   lote:this.material[0].lote,
    //   material:`${this.material[0].material.nombre} (${this.material[0].material.ancho}x${this.material[0].material.largo})`,
    //   marca:this.material[0].material.marca,
    //   muestras:this.muestras,
    //   gramaje:{promedio:this.promedio.toFixed(this.Gramaje_nf),desviacion:this.desviacion.toFixed(this.Gramaje_nf),masa_inicial:this.inicial,masa_final:this.final, gramaje:this.gramaje},
    //   cobb:{cobb:this.cobb,promedio_top:this.promedio_cobb_top,desviacion_top:this.desviacion_cobb_top,promedio_back:this.promedio_cobb_back,desviacion_back:this.desviacion_cobb_back},
    //   calibre:{mm:this.calibre,um:this.Um_calibre,pt:this.pt_calibre,promedio:this.promedio_calibre.toFixed(this.Calibre_nf),desviacion:this.desviacion_calibre.toFixed(this.Calibre_nf),promedio_um:this.promedio_calibre_um.toFixed(this.Calibre_nf_um),desviacion_um:this.desviacion_calibre_um.toFixed(this.Calibre_nf_um),promedio_pt:this.promedio_calibre_pt.toFixed(this.Calibre_nf_pt),desviacion_pt:this.desviacion_calibre_pt.toFixed(this.Calibre_nf_pt)},
    //   curling:{curling:this.curling,promedio:this.promedio_curling.toFixed(this.curling_nf),desviacion:this.desviacion_curling.toFixed(this.curling_nf)},
    //   blancura:{blancura:this.blancura,promedio:this.promedio_blancura.toFixed(this.blancura_nf),desviacion:this.desviacion_curling.toFixed(this.curling_nf)}
    // }

    let certificado = {
      gramaje:{promedio:this.promedio.toFixed(this.Gramaje_nf),desviacion:this.desviacion.toFixed(this.Gramaje_nf),masa_inicial:this.inicial,masa_final:this.final, gramaje:this.gramaje},
      cobb:{cobb:this.cobb,promedio_top:this.promedio_cobb_top,desviacion_top:this.desviacion_cobb_top,promedio_back:this.promedio_cobb_back,desviacion_back:this.desviacion_cobb_back},
      calibre:{mm:this.calibre,um:this.Um_calibre,pt:this.pt_calibre,promedio:this.promedio_calibre.toFixed(this.Calibre_nf),desviacion:this.desviacion_calibre.toFixed(this.Calibre_nf),promedio_um:this.promedio_calibre_um.toFixed(this.Calibre_nf_um),desviacion_um:this.desviacion_calibre_um.toFixed(this.Calibre_nf_um),promedio_pt:this.promedio_calibre_pt.toFixed(this.Calibre_nf_pt),desviacion_pt:this.desviacion_calibre_pt.toFixed(this.Calibre_nf_pt)},
      curling:{curling:this.curling,promedio:this.promedio_curling.toFixed(this.curling_nf),desviacion:this.desviacion_curling.toFixed(this.curling_nf)},
      blancura:{blancura:this.blancura,promedio:this.promedio_blancura.toFixed(this.blancura_nf),desviacion:this.desviacion_blancura.toFixed(this.blancura_nf)},
      escuadra:{escuadra:this.escuadra,promedio:this.promedio_escuadra.toFixed(this.escuadra_nf),desviacion:this.desviacion_escuadra.toFixed(this.escuadra_nf), max_escuadra:this.max_escuadra, min_escuadra:this.min_escuadra},
      contra_escuadra:{contra_escuadra:this.contra_escuadra, promedio:this.promedio_contra_escuadra.toFixed(this.contra_escuadra_nf), desviacion:this.desviacion_contra_escuadra.toFixed(this.contra_escuadra_nf), min_contra_escuadra:this.min_contra_escuadra, max_contra_escuadra:this.max_contra_escuadra},
      pinza:{pinza:this.pinza,promedio:this.promedio_pinza.toFixed(this.pinza_nf), desviacion:this.desviacion_pinza.toFixed(this.pinza_nf), min_pinza:this.min_pinza, max_pinza:this.max_pinza},
      contra_pinza:{contra_pinza:this.contra_pinza,promedio:this.promedio_contra_pinza.toFixed(this.contra_pinza_nf), desviacion:this.desviacion_contra_pinza.toFixed(this.contra_pinza_nf), min_contra_pinza:this.min_contra_pinza, max_contra_pinza:this.max_contra_pinza},
      especificacion:{gramaje_min: this.material[0].material.gramaje_e[0], gramaje_std:this.material[0].material.gramaje_e[1], gramaje_max:this.material[0].material.gramaje_e[2], 
        cobb_back_min:this.material[0].material.cobb[3],cobb_back_std:this.material[0].material.cobb[4],cobb_back_max:this.material[0].material.cobb[5], 
        cobb_top_min:this.material[0].material.cobb[0],cobb_top_std:this.material[0].material.cobb[1],cobb_top_max:this.material[0].material.cobb[2],
        calibre_mm_min:this.material[0].material.calibre_e[0],calibre_mm_std:this.material[0].material.calibre_e[1],calibre_mm_max:this.material[0].material.calibre_e[2],
        calibre_um_min:this.material[0].material.calibre_e[6],calibre_um_std:this.material[0].material.calibre_e[7],calibre_um_max:this.material[0].material.calibre_e[8],
        calibre_pt_min:this.material[0].material.calibre_e[3],calibre_pt_std:this.material[0].material.calibre_e[4],calibre_pt_max:this.material[0].material.calibre_e[5],
        blancura_min:this.material[0].material.blancura[0], blancura_std:this.material[0].material.blancura[1], blancura_max:this.material[0].material.blancura[2],
        curling_min:this.material[0].material.curling[0],curling_std:this.material[0].material.curling[1], curling_max:this.material[0].material.curling[2]
      }
    }

    let muestras_ = [];
    let muestras__ = [];
    
    for(let i=0;i<this.muestras;i++){
      muestras_.push(i+1)
      muestras__.push(i+1)
    }

    let max_masa_inicial = Math.max(...certificado.gramaje.masa_inicial)
    let min_masa_inicial = Math.min(...certificado.gramaje.masa_inicial)
    let max_masa_final = Math.max(...certificado.gramaje.masa_final)
    let min_masa_final = Math.min(...certificado.gramaje.masa_final)
    let max_gramaje = Math.max(...certificado.gramaje.gramaje)
    let min_gramaje = Math.min(...certificado.gramaje.gramaje)
    let top_mensaje = []
    
    let direccion = []
    let cobb_top = []
    let cobb_back = []
    let cobb_top_ = []
    let cobb_back_ = []
    let n = 0
    for(let i=0;i<certificado.cobb.cobb.length;i++){
      if(i+1 <= (certificado.cobb.cobb.length)/2){

          
        cobb_back.push(' ')
        cobb_top.push(certificado.cobb.cobb[i])
        cobb_top_.push(certificado.cobb.cobb[i])

      }else{
        cobb_back.push(certificado.cobb.cobb[i])
        cobb_back_.push(certificado.cobb.cobb[i])
      }
    }
    let min_cobb_top = Math.min(...cobb_top_)
    let max_cobb_top = Math.max(...cobb_top_)
    let max_cobb_back = Math.max(...cobb_back_)
    let min_cobb_back = Math.min(...cobb_back_)

    let min_calibre = Math.min(...certificado.calibre.mm)
    let min_calibre_um = Math.min(...certificado.calibre.um)
    let min_calibre_pt =  Math.min(...certificado.calibre.pt)
    let max_calibre = Math.max(...certificado.calibre.mm)
    let max_calibre_um = Math.max(...certificado.calibre.um)
    let max_calibre_pt = Math.max(...certificado.calibre.pt)

    let min_curling = Math.min(...certificado.curling.curling)
    let max_curling = Math.max(...certificado.curling.curling)

    let min_blancura = Math.min(...certificado.blancura.blancura)
    let max_blancura = Math.max(...certificado.blancura.blancura)




    async function GenerarCertificado(){
      const pdf = new PdfMakeWrapper();
      PdfMakeWrapper.setFonts(pdfFonts);
      pdf.pageOrientation('landscape');
      pdf.pageSize('A4');

      pdf.add(
        new Table([
          [
            new Cell(await new Img('../../assets/poli_cintillo.png').width(50).margin([0, 5]).build()).alignment('center').rowSpan(4).end,
            new Cell(new Txt(`
            FORMATO DE REPORTE DE ANÁLISIS DE SUSTRATO
            `).bold().end).alignment('center').fontSize(9).rowSpan(4).end,
            new Cell(new Txt('Código: FLC-004').end).fillColor('#dedede').fontSize(5).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('N° de Revisión: 0').end).fillColor('#dedede').fontSize(5).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('Fecha de Revision: 28/06/2023').end).fillColor('#dedede').fontSize(5).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('Página: 1 de 1').end).fillColor('#dedede').fontSize(5).alignment('center').end,
          ],
        ]).widths(['25%','50%','25%']).end
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt(' ').end).border([false]).fontSize(1).end
          ]
        ]).widths(['100%']).end
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('INFORMACIÓN DE SUSTRATO').bold().end).fontSize(8).color('#ffffff').fillColor('#000000').decorationColor('#ffffff').alignment('center').end
          ]
        ]).widths(['100%']).end
      )
      pdf.add(
        new Table([
          [
            new Cell(new Txt(' ').end).border([false]).fontSize(1).end
          ]
        ]).widths(['100%']).end
      )
      pdf.add(
        new Table([
          [
            new Cell(new Txt('Descripción:').end).fillColor('#dedede').fontSize(6).end,
            new Cell(new Txt('Papel Litho 90g').end).fontSize(6).colSpan(3).end,
            new Cell(new Txt('').end).fontSize(6).end,
            new Cell(new Txt('').end).fontSize(6).end,
            new Cell(new Txt('Marca:').end).fontSize(6).fillColor('#dedede').end,
            new Cell(new Txt('B&B').bold().fontSize(6).fontSize(6).end).colSpan(3).end,
            new Cell(new Txt('').end).fontSize(6).end,
            new Cell(new Txt('').end).fontSize(6).end,

          ],
          [
            new Cell(new Txt('Lote:').end).fontSize(6).fillColor('#dedede').end,
            new Cell(new Txt('2023576').end).fontSize(6).end,
            new Cell(new Txt('Fecha:').end).fontSize(6).fillColor('#dedede').end,
            new Cell(new Txt('28/06/2023').end).fontSize(6).end,
            new Cell(new Txt('Tamaño de muestra (cm):').end).fontSize(6).fillColor('#dedede').end,
            new Cell(new Txt('12,5 x 12,5').end).fontSize(6).end,
            new Cell(new Txt('Area (cm²):').end).fontSize(6).fillColor('#dedede').end,
            new Cell(new Txt('156.25').end).fontSize(6).end,
          ],
        ]).widths(['12%','12%','12%','12%','16%','12%','12%','12%']).end
      )
      pdf.add(
        new Table([
          [
            new Cell(new Txt(' ').end).border([false]).fontSize(1).end
          ]
        ]).widths(['100%']).end
      )
      pdf.add(
        new Table([
          [
            new Cell(new Txt('PROPIEDADES A EVALUAR DEL SUSTRATO').bold().end).fontSize(8).color('#ffffff').fillColor('#000000').decorationColor('#ffffff').alignment('center').end
          ]
        ]).widths(['100%']).end
      )
      pdf.add(
        new Table([
          [
            new Cell(new Txt(' ').end).border([false]).fontSize(1).end
          ]
        ]).widths(['100%']).end
      )
      pdf.add(
        new Table([
          [
            new Cell(new Txt('#').alignment('center').end).fontSize(6).margin([0,15]).rowSpan(4).fillColor('#4e4e4e').color('#FFFFFF').end,
            new Cell(new Txt('Gramaje').alignment('center').end).fontSize(6).colSpan(2).fillColor('#4e4e4e').color('#FFFFFF').end,
            new Cell(new Txt('Gramaje').alignment('center').end).fontSize(6).fillColor('#4e4e4e').color('#FFFFFF').end,
            new Cell(new Txt('Cobb').alignment('center').end).fontSize(6).colSpan(3).fillColor('#4e4e4e').color('#FFFFFF').end,
            new Cell(new Txt('-').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('Gramaje').alignment('center').end).fontSize(6).fillColor('#4e4e4e').color('#FFFFFF').end,
            new Cell(new Txt('Calibre').alignment('center').end).fontSize(6).colSpan(3).fillColor('#4e4e4e').color('#FFFFFF').end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).fillColor('#4e4e4e').color('#FFFFFF').end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).fillColor('#4e4e4e').color('#FFFFFF').end,
            new Cell(new Txt('Curling').alignment('center').end).fontSize(6).fillColor('#4e4e4e').color('#FFFFFF').end,
            new Cell(new Txt('Blancura').alignment('center').end).fontSize(6).fillColor('#4e4e4e').color('#FFFFFF').end,
            new Cell(new Txt('').alignment('center').end).rowSpan(3).border([false,false]).fontSize(6).color('#FFFFFF').end,
            new Cell(new Txt('').alignment('center').end).rowSpan(4).fontSize(6).fillColor('#4e4e4e').end,
            new Cell(new Txt('Dimensiones del pliego (mm)').alignment('center').end).fillColor('#4e4e4e').color('#FFFFFF').colSpan(4).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).end,
          ],
          [
            new Cell(new Txt(' ').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('Masa inicial (g)').alignment('center').margin([0,15]).end).rowSpan(3).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('Gramaje\n (g/m²)').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('Masa final (g)').alignment('center').margin([0,15]).end).rowSpan(3).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('Cobb (g/m²) \n TOP').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('Cobb (g/m²) \nBACK').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('(mm)').alignment('center').margin([0,5]).end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('(um)').alignment('center').margin([0,5]).end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('(pt)').alignment('center').margin([0,5]).end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('(s)').alignment('center').margin([0,5]).end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('(%)').alignment('center').margin([0,5]).end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).color('#FFFFFF').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).color('#FFFFFF').end,
            new Cell(new Txt('Escuadra').alignment('center').margin([0,15]).end).rowSpan(3).fillColor('#bdbdbd').fontSize(6).end,
            new Cell(new Txt('contra escuadra').alignment('center').margin([0,15]).end).rowSpan(3).fillColor('#bdbdbd').fontSize(6).end,
            new Cell(new Txt('Pinza').alignment('center').margin([0,15]).end).rowSpan(3).fillColor('#bdbdbd').fontSize(6).end,
            new Cell(new Txt('Contra pinza').alignment('center').margin([0,15]).end).rowSpan(3).fillColor('#bdbdbd').fontSize(6).end,
          ],
          [
            new Cell(new Txt(' ').alignment('center').end).fontSize(6).fillColor('#cecece').end,
            new Cell(new Txt('Masa inicial (g)').alignment('center').end).fontSize(6).fillColor('#cecece').end,
            new Cell(new Txt('COVENIN 945-84').alignment('center').end).fontSize(5).fillColor('#cecece').end,
            new Cell(new Txt('Masa final (g)').alignment('center').end).fontSize(6).fillColor('#cecece').end,
            new Cell(new Txt('COVENIN 1243-78').alignment('center').margin([0,5]).end).colSpan(2).fontSize(5).fillColor('#cecece').end,
            new Cell(new Txt('-').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('COVENIN 946-79').alignment('center').margin([0,5]).end).colSpan(3).fontSize(6).fillColor('#cecece').end,
            new Cell(new Txt('(um)').alignment('center').end).fontSize(6).fillColor('#cecece').end,
            new Cell(new Txt('(pt)').alignment('center').end).fontSize(6).fillColor('#cecece').end,
            new Cell(new Txt('ISO 5635').alignment('center').margin([0,5]).end).fontSize(5).fillColor('#cecece').end,
            new Cell(new Txt('ISO 2470').alignment('center').margin([0,10]).end).rowSpan(2).fontSize(5).fillColor('#cecece').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('Escuadra').alignment('center').end).fillColor('#cecece').fontSize(6).end,
            new Cell(new Txt('contra escuadra').alignment('center').end).fillColor('#cecece').fontSize(6).end,
            new Cell(new Txt('Pinza').alignment('center').end).fillColor('#cecece').fontSize(6).end,
            new Cell(new Txt('Contra pinza').alignment('center').end).fillColor('#cecece').fontSize(6).end,
          ],
          [
            new Cell(new Txt(' ').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('Masa inicial (g)').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('TAPPI T410').alignment('center').end).fontSize(5).fillColor('#eeeded').end,
            new Cell(new Txt('Masa final (g)').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('TAPPI T411').alignment('center').end).colSpan(2).fontSize(5).fillColor('#eeeded').end,
            new Cell(new Txt('-').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('TAPPI T411').alignment('center').end).colSpan(3).fontSize(5).fillColor('#eeeded').end,
            new Cell(new Txt('(um)').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('(pt)').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('TAPPI T466').alignment('center').end).fontSize(5).fillColor('#eeeded').end,
            new Cell(new Txt('(%)').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).color('#FFFFFF').end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).color('#FFFFFF').end,
            new Cell(new Txt('Escuadra').alignment('center').end).fillColor('#eeeded').fontSize(6).end,
            new Cell(new Txt('contra escuadra').alignment('center').end).fillColor('#eeeded').fontSize(6).end,
            new Cell(new Txt('Pinza').alignment('center').end).fillColor('#eeeded').fontSize(6).end,
            new Cell(new Txt('Contra pinza').alignment('center').end).fillColor('#eeeded').fontSize(6).end,
          ],
          [
            new Cell(new Stack(muestras_).end).rowSpan(2).fontSize(6).alignment('center').end,
            new Cell(new Stack(certificado.gramaje.masa_inicial).fontSize(6).alignment('center').end).rowSpan(2).end,
            new Cell(new Stack(certificado.gramaje.gramaje).end).fontSize(6).alignment('center').rowSpan(2).end,
            new Cell(new Stack(certificado.gramaje.masa_final).fontSize(6).alignment('center').end).rowSpan(2).fillColor('#dedede').end,
            new Cell(new Stack(cobb_top).end).rowSpan(2).fontSize(6).alignment('center').fillColor('#dedede').end,
            new Cell(new Stack(cobb_back).end).rowSpan(2).fontSize(6).alignment('center').fillColor('#dedede').end,
            new Cell(new Stack(certificado.calibre.mm).end).rowSpan(2).fontSize(6).alignment('center').end,
            new Cell(new Stack(certificado.calibre.um).end).rowSpan(2).fontSize(6).alignment('center').end,
            new Cell(new Stack(certificado.calibre.pt).end).rowSpan(2).fontSize(6).alignment('center').end,
            new Cell(new Stack(certificado.curling.curling).end).rowSpan(2).fontSize(6).alignment('center').fillColor('#dedede').end,
            new Cell(new Stack(certificado.blancura.blancura).end).rowSpan(2).fontSize(6).alignment('center').end,
            new Cell(new Txt('').alignment('center').end).rowSpan(2).border([false,false]).fontSize(6).color('#FFFFFF').end,
            new Cell(new Stack(muestras__).alignment('center').end).rowSpan(2).fontSize(6).color('#FFFFFF').end,
            new Cell(new Stack(certificado.escuadra.escuadra).alignment('center').end).rowSpan(2).fontSize(6).end,
            new Cell(new Stack(certificado.contra_escuadra.contra_escuadra).alignment('center').end).rowSpan(2).fontSize(6).end,
            new Cell(new Stack(certificado.pinza.pinza).alignment('center').end).rowSpan(2).fontSize(6).end,
            new Cell(new Stack(certificado.contra_pinza.contra_pinza).alignment('center').end).rowSpan(2).fontSize(6).end,
          ],
          [
            new Cell(new Txt('').end).fontSize(6).alignment('center').end,
            new Cell(new Txt('').fontSize(6).alignment('center').end).end,
            new Cell(new Txt('').end).fontSize(6).alignment('center').end,
            new Cell(new Txt('').fontSize(6).alignment('center').end).fillColor('#dedede').end,
            new Cell(new Txt('').end).fontSize(6).alignment('center').fillColor('#dedede').end,
            new Cell(new Stack(cobb_back).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('').end).fontSize(6).alignment('center').end,
            new Cell(new Txt('').end).fontSize(6).alignment('center').end,
            new Cell(new Txt('').end).fontSize(6).alignment('center').end,
            new Cell(new Txt('').end).fontSize(6).alignment('center').fillColor('#dedede').end,
            new Cell(new Txt('').end).fontSize(6).alignment('center').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).color('#FFFFFF').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).color('#FFFFFF').end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).end,
          ]
        ]).widths(['4.5%','6.5%','6.5%','6.5%','6.5%','6.5%','6.5%','6.5%','6.5%','6.5%','6.5%','1%','3.5%','6.5%','6.5%','6.5%','6.5%']).end
      )
      pdf.add(
        new Table([
          [
            new Cell(new Txt('X̅').alignment('center').bold().end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('n/a').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.gramaje.promedio).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('n/a').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(`${certificado.cobb.promedio_top.toString()}`).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(`${certificado.cobb.promedio_back.toString()}`).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.calibre.promedio).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.calibre.promedio_um).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.calibre.promedio_pt).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.curling.promedio).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.blancura.promedio).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('X̅').alignment('center').end).fillColor('#bdbdbd').fontSize(6).end,
            new Cell(new Txt(certificado.escuadra.promedio).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.contra_escuadra.promedio).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.pinza.promedio).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.contra_pinza.promedio).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
          ],
          [
            new Cell(new Txt('S').alignment('center').bold().end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('n/a').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.gramaje.desviacion).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('n/a').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(`${certificado.cobb.desviacion_top.toString()}`).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(`${certificado.cobb.desviacion_back.toString()}`).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.calibre.desviacion).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.calibre.desviacion_um).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.calibre.desviacion_pt).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.curling.desviacion).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.blancura.desviacion).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('S').alignment('center').end).fillColor('#bdbdbd').fontSize(6).end,
            new Cell(new Txt(certificado.escuadra.desviacion).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.contra_escuadra.desviacion).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.pinza.desviacion).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.contra_pinza.desviacion).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
          ],
          [
            new Cell(new Txt('mín').alignment('center').bold().end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(min_masa_inicial.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(min_gramaje.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(min_masa_final.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(`${min_cobb_top}`).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(`${min_cobb_back}`).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(min_calibre.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(min_calibre_um.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(min_calibre_pt.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(min_curling.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(min_blancura.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('mín').alignment('center').end).fillColor('#bdbdbd').fontSize(6).end,
            new Cell(new Txt(certificado.escuadra.min_escuadra.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.contra_escuadra.min_contra_escuadra.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.pinza.min_pinza.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.contra_pinza.min_contra_pinza.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
          ],
          [
            new Cell(new Txt('máx').alignment('center').bold().end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(max_masa_inicial.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(max_gramaje.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(max_masa_final.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(`${max_cobb_top}`).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(`${max_cobb_back}`).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(max_calibre.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(max_calibre_um.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(max_calibre_pt.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(max_curling.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(max_blancura.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('máx').alignment('center').end).fillColor('#bdbdbd').fontSize(6).end,
            new Cell(new Txt(certificado.escuadra.max_escuadra.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.contra_escuadra.max_contra_escuadra.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.pinza.max_pinza.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.contra_pinza.max_contra_pinza.toString()).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
          ],
          [
            new Cell(new Txt('ESPECIFICACIÓN').alignment('center').bold().end).rowSpan(3).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('mín').alignment('center').bold().end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.gramaje_min).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('n/a').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.cobb_top_min).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.cobb_back_min).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.especificacion.calibre_mm_min).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.calibre_um_min).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.calibre_pt_min).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.curling_min).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.blancura_min).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('std').alignment('center').end).fillColor('#bdbdbd').fontSize(6).end,
            new Cell(new Txt('88.96').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('88.96').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('88.96').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt('0.09').alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
          ],
          [
            new Cell(new Txt('').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('std').alignment('center').bold().end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.gramaje_std).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('n/a').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.cobb_top_std).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.cobb_back_std).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.especificacion.calibre_mm_std).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.calibre_um_std).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.calibre_pt_std).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.curling_std).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.blancura_std).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).color('#FFFFFF').end,
            new Cell(new Txt('Medicion N°').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('1').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('2').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('3').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
          ],
          [
            new Cell(new Txt('').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('máx').alignment('center').bold().end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.gramaje_max).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('n/a').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.cobb_top_max).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.cobb_back_max).alignment('center').end).fontSize(6).fillColor('#bdbdbd').end,
            new Cell(new Txt(certificado.especificacion.calibre_mm_max).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.calibre_um_max).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.calibre_pt_max).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.curling_max).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt(certificado.especificacion.blancura_max).alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).color('#FFFFFF').end,
            new Cell(new Txt('Temp.').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
          ],
          [
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).end,
            new Cell(new Txt('').alignment('center').end).border([false,false]).fontSize(6).color('#FFFFFF').end,
            new Cell(new Txt('Humedad.').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
            new Cell(new Txt('').alignment('center').end).fontSize(6).fillColor('#eeeded').end,
          ]
        ]).widths(['4.5%','6.5%','6.5%','6.5%','6.5%','6.5%','6.5%','6.5%','6.5%','6.5%','6.5%','1%','3.5%','6.5%','6.5%','6.5%','6.5%']).end
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt(' ').end).border([false]).fontSize(1).end
          ]
        ]).widths(['100%']).end
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('OBSERVACIÓN').fontSize(8).end).fillColor('#000000').color('#FFFFFF').end,
            new Cell(new Txt('RESULTADO DE ANÁLISIS').fontSize(8).end).fillColor('#0000000').color('#FFFFFF').colSpan(2).end,
            new Cell(new Txt('').end).fontSize(8).end
          ],
          [
            new Cell(new Txt('').fontSize(8).end).end,
            new Cell(new Txt('APROBADO').bold().end).alignment('center').end,
            new Cell(new Txt(`FIRMA: Andrés Calcurian
                              FECHA:28/06/2023`).fontSize(8).end).end
          ]
        ]).widths(['60%','20%','20%']).end
      )


      pdf.create().download(`certificado`)
    }
    GenerarCertificado()
  }

  buscarLote(e){
    this.api.getAlmacenadoPorLote(e)
      .subscribe((resp:any)=>{
        if(resp.length < 1){
          Swal.fire({
            title:'Error',
            text:'No existe sustrato registrado con este número de lote',
            timer:3000,
            showConfirmButton:false,
            timerProgressBar:true,
            icon:'error'
          })
        }
        this.material = resp
        for(let i=0;i<this.material.length;i++){
          let index = this.cantidades.indexOf(this.material[i].cantidad)
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
      })
  }

  
}

