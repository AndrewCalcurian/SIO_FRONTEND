import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';

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
   }
  
  ngOnInit(): void {
    this.obtenerClientes()
  }

  public CLIENTES = []
  obtenerClientes(){
    this.api.GetClientes()
      .subscribe((resp:any)=>{
        this.CLIENTES = resp.clientes
      })
  }


  public PRODUCTOS = []
  cliente_selected(e){
    if(e.target.value != '#')
    {
      this.api.getById(e.target.value)
        .subscribe((resp:any)=>{
          this.PRODUCTOS = resp.productos;
          // // console.log(this.PRODUCTOS)
      })
    }else{
      this.PRODUCTOS = []
    }
  }

  public PRODUCTO = [];
  public producto__ = ''
  producto_selected(e){
    if(e != '#'){
      this.PRODUCTO = e
      let produc = this.PRODUCTOS.find(x=> x._id == e)
      this.producto__ = produc.producto
      console.log(produc.producto)
    }else{
      this.PRODUCTO = []
    }
  }

  public ORDEN_COMPRA = ''
  OC(e){
    this.ORDEN_COMPRA = e
  }

  public Fecha_entrega = ''
  date_(e){
    this.Fecha_entrega = e
  }
  public _Fecha_entrega = ''
  date__(e){
    this._Fecha_entrega = e
  }

  public Loaded = false
  datos(){
    this.Loaded = true
  }

  public _CANTIDAD = ''
  NuevaCantidad(e){
    this._CANTIDAD = e
  }

  public __Fecha = ''
  Fecha__(e){
    this.__Fecha = e
  }


  public DATOS = []
  AgregarNuevo(){
    this.DATOS.push(
    {
     producto:this.PRODUCTO,
     nombre:this.producto__,
     cantidad:this._CANTIDAD,
     fecha:this.__Fecha
    })

    this.__Fecha = ''
    this._CANTIDAD = ''
    this.PRODUCTO = []
  }

  Eliminar(i){
    this.DATOS.splice(i,1)
  }

  Editar(i){
    let _i_ = i.toString()
    document.getElementById(`field_c${_i_}`).style.display = 'block';
    document.getElementById(`field_f${_i_}`).style.display = 'block';
    document.getElementById(`dato_c${_i_}`).style.display = 'none';
    document.getElementById(`dato_f${_i_}`).style.display = 'none';
    document.getElementById(`buttons${_i_}`).style.display = 'none'
    document.getElementById(`buttons_${_i_}`).style.display = 'block'
  }

  editarCantidad(e,i){
    this.DATOS[i].cantidad = e
  }

  editarFecha(e,i){
    this.DATOS[i].fecha = e
  }

  FinalizarEdicion(i){
    let _i_ = i.toString()
    document.getElementById(`field_c${_i_}`).style.display = 'none';
    document.getElementById(`field_f${_i_}`).style.display = 'none';
    document.getElementById(`dato_c${_i_}`).style.display = 'block';
    document.getElementById(`dato_f${_i_}`).style.display = 'block';
    document.getElementById(`buttons${_i_}`).style.display = 'block'
    document.getElementById(`buttons_${_i_}`).style.display = 'none'
  }


}

