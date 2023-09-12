import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';

import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { rgb2lab, lab2rgb, deltaE } from 'rgb-lab'

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
  
  public proveedores;
  public proveedor_selected = '#';
  public Fabricantes;
  public Fabricantes_;
  public fabricante_selected;
  public Materia_prima;
  public Materia_prima_filtered = [];
  public Materia_prima_selected;

  public detalles:boolean = false;

  public N_factura =''
  public N_OC = ''
  public Transportista = ''
  public Lote = ''
  public F_fabricacion
  public codigo = ''

  public cantidades:boolean = false

  public Condicion:boolean = false

  public NuevaRecepcion:boolean = false;

  public Detallar = false
  public Detallados = [] 
  public index_ 
  public index__ 

  public confirmado = false;
  public condicionado = false;

  GuardarCambios(){
    let productos = this.Pedido[this.index_].productos
    for(let i=0;i<productos.length;i++){
      if(this.Pedido[this.index_].productos[i].nombre === this.Detallados[0].nombre && this.Pedido[this.index_].productos[i].marca === this.Detallados[0].marca)
        {
          this.Pedido[this.index_].productos.splice(i,1)
          i--;
        }

      if(i === productos.length -1){
        // console.log(this.Detallados)
        let total = 0;
        for(let n=0;n<this.Detallados.length;n++){
          total = Number(total) + Number(this.Detallados[n].capacidad)
          total = Number(total.toFixed(2));

          console.log(total)
          console.log(this.Pedido[this.index_])
          this.Pedido[this.index_].totales[this.index__].total = total
          this.Pedido[this.index_].productos.push(this.Detallados[n])
        }
        Swal.fire({
          title:'Edición realizada con exito',
          icon:'success',
          toast:true,
          timer:1500,
          showConfirmButton:false,
          timerProgressBar:true,
          position:'top-end'
        })
        this.abrirDetalles()
        return
      }
    }

  }

  abrirDetalles_(i,n, producto, marca){

    this.index_ = i;
    this.index__ = n;
    this.Detallados = [] 
    let productos = this.Pedido[i].productos
    let filtro = productos.filter(x=>x.nombre === producto && x.marca === marca)
    this.Detallados.push(filtro)
    console.log(this.Detallados)
    this.Detallados = this.Detallados[0]
    this.abrirDetalles();
   }

   public abrirDetalles(){
    if(!this.Detallar){
      this.Detallar = true
    }else{
      this.Detallar = false
    }
   }

  ngOnInit(): void {
    this.buscarProveedores();
    this.buscarFabricantes();
    this.buscarMateriaPrima();
    this.BuscarFacturas();
  
  }

  BuscarFacturas(){
    this.api.getFacturacion()
      .subscribe((resp:any)=>{
        this.Pedido = resp
      })
  }

  buscarProveedores(){
    this.api.GetProveedores()
      .subscribe((resp:any)=>{
        this.proveedores = resp;
      })  
  }

  buscarFabricantes(){
    this.api.getFabricantes()
      .subscribe((resp:any)=>{
        this.Fabricantes = resp;
      })  
  }

  buscarMateriaPrima(){
    this.api.getMateriaPrima()
      .subscribe((resp:any)=>{
        this.Materia_prima = resp;
        console.log(this.Materia_prima)
      })  
  }

  SeleccionarProveedor(e){
    if(e === '#'){
      this.Fabricantes = null;
      return
    }

    let fabricante = this.proveedores.filter(x=> x._id === e)
    this.proveedor_selected = e
    this.Fabricantes_ = fabricante[0].fabricantes
  }

  SeleccionarFabricantes(e){
    
    let fabricante = this.Fabricantes.filter(x=> x.nombre === e)
    this.fabricante_selected = fabricante[0]
  }

  public grupo__
  SeleccionarGrupo(e){
    this.grupo__ = e
    for(let i=0; i<this.Materia_prima.length;i++){
      for(let n=0; n<this.Materia_prima[i].proveedor.length;n++){
        console.log(this.Materia_prima[i].proveedor[n],'-',this.fabricante_selected._id)
        if(this.Materia_prima[i].proveedor[n] === this.fabricante_selected._id)
        {
          if(this.Materia_prima[i].grupo.nombre === e){
            this.Materia_prima_filtered.push(this.Materia_prima[i])
            console.log(this.grupo__)
          }
        }
      }
    }

    }

  cambiar_fabricacion_Detalles(e){
    for(let i=0;i<this.Detallados.length;i++){
      this.Detallados[i].fabricacion = e
    }
  }

  cambiar_lote_Detalles(e){
    for(let i=0;i<this.Detallados.length;i++){
      this.Detallados[i].lote = e
    }
  }

  cambiar_fabricacion(e){
    for(let i=0;i<this.envases.length;i++){
      this.envases[i].fabricacion = e
    }
  }

  cambiar_lote(e){
    for(let i=0;i<this.envases.length;i++){
      this.envases[i].lote = e
    }
  }

  Selected_Materia(e){
    if(e === '#'){
      this.cantidades = false
      return
    }
    this.cantidades = true
    this.Materia_prima_selected = this.Materia_prima_filtered.find(x=>x._id === e)
  }

  delete(i){
    this.envases.splice(i,1)
    this.cambiar_capacidad()
  }

  AgregarNuevo(capacidad, codigo){
    this.envases.push({
      material:this.Materia_prima_selected._id,
      nombre:this.Materia_prima_selected.nombre,
      marca:this.Materia_prima_selected.marca,
      fabricacion:this.F_fabricacion,
      capacidad:capacidad,
      lote:this.Lote,
      numero:codigo
    })

    this.cambiar_capacidad();
  }


  public cantidad
  public resto
  public envases = []
  public total_kilos
  calcularLatas(e){
    this.total_kilos = e;
    this.envases = []
    let cantidad = 0
    let contador = 0

    this.cantidad = 0;
    this.resto = 0;
    while(cantidad<e){
        let iteration = cantidad + this.Materia_prima_selected.neto
        console.log(iteration)
        if(iteration<=e){
          cantidad = Number(iteration.toFixed(2));
          contador++
          this.cantidad = contador
        }else{
          let final = iteration - e;
          final = this.Materia_prima_selected.neto - final
          this.resto = Number(final.toFixed(2))
          cantidad = iteration;
        }
    }


    if(this.resto > 0){
      this.envases.push({
        material:this.Materia_prima_selected._id,
        nombre:this.Materia_prima_selected.nombre,
        marca:this.Materia_prima_selected.marca,
        fabricacion:this.F_fabricacion,
        capacidad:this.resto,
        lote:this.Lote,
        numero:1
      })
      for(let i=0;i<contador;i++){
        this.envases.push({
          material:this.Materia_prima_selected._id,
          nombre:this.Materia_prima_selected.nombre,
          marca:this.Materia_prima_selected.marca,
          capacidad:this.Materia_prima_selected.neto,
          fabricacion:this.F_fabricacion,
          lote:this.Lote,
          numero:i+2
        })
        console.log(this.envases)
      }
    }
  }


  Borrar_detallado(i){
    this.Detallados.splice(i,1)
  }

  verDetalles_(){
    if(!this.detalles){
      this.detalles = true;
    }else{
      this.detalles = false;
    }
  }

  verDetalles(){
    if(!this.detalles){
      this.detalles = true;
    }else{
      if(!this.confirmado){
        this.confirmado = true;
      }
      this.detalles = false;
    }
  }

  verCondiciones(){
    if(!this.Condicion){
      this.Condicion = true;
    }else{
      if(!this.condicionado){
        this.condicionado = true;
      }
      this.Condicion = false;
    }
  }

  public condicion___
  guardarCondiciones(){
    let condicion
    switch(this.grupo__){
      case 'Sustrato':
        condicion = [
          (<HTMLInputElement>document.getElementById('11')).checked, 
          (<HTMLInputElement>document.getElementById('12')).checked, 
          (<HTMLInputElement>document.getElementById('13')).checked, 
          (<HTMLInputElement>document.getElementById('14')).checked, 
          (<HTMLInputElement>document.getElementById('15')).checked, 
          (<HTMLInputElement>document.getElementById('16')).checked, 
          (<HTMLInputElement>document.getElementById('17')).checked, 
          (<HTMLInputElement>document.getElementById('18')).checked, 
          (<HTMLInputElement>document.getElementById('19')).checked, 
          (<HTMLInputElement>document.getElementById('110')).checked, 
        ]
        break;
      case 'Cajas Corrugadas':
        condicion = [
          (<HTMLInputElement>document.getElementById('21')).checked, 
          (<HTMLInputElement>document.getElementById('22')).checked, 
          (<HTMLInputElement>document.getElementById('23')).checked, 
          (<HTMLInputElement>document.getElementById('24')).checked, 
          (<HTMLInputElement>document.getElementById('25')).checked, 
        ]
        break;
      default:
        condicion = [
          (<HTMLInputElement>document.getElementById('01')).checked, 
          (<HTMLInputElement>document.getElementById('02')).checked, 
          (<HTMLInputElement>document.getElementById('03')).checked, 
          (<HTMLInputElement>document.getElementById('04')).checked, 
          (<HTMLInputElement>document.getElementById('05')).checked, 
        ]
        break;
    }

    this.condicion___ = condicion
    this.verCondiciones()

  }

  verCondiciones_(){
    if(!this.Condicion){
      this.Condicion = true;
    }else{
      this.Condicion = false;
    }
  }

  public Factura;
  public Pedido = [];

  Guardar(){

    (<HTMLInputElement>document.getElementById('disabled_1')).disabled = true;
    (<HTMLInputElement>document.getElementById('disabled_2')).disabled = true;
    (<HTMLInputElement>document.getElementById('disabled_3')).disabled = true;
    (<HTMLInputElement>document.getElementById('disabled_4')).disabled = true;
    (<HTMLInputElement>document.getElementById('grupo')).value = '#';
    this.cantidad = null;
    this.resto = null;
    this.F_fabricacion = null;
    this.codigo = null;
    this.Materia_prima_filtered = [];
    this.cantidades = null
    this.fabricante_selected = null

    this.confirmado = false;
    this.condicionado = false;

    
    
    if(!this.Factura){
      this.Factura = {
        factura:this.N_factura,
        orden:this.N_OC,
        transportista:this.Transportista,
        productos:this.envases,
        totales:[{lote:`${this.Lote}`,producto:`${this.Materia_prima_selected.nombre}`, marca:`${this.Materia_prima_selected.marca}`,total:this.total_kilos}],
        condicion:[this.condicion___],
        proveedor:this.proveedor_selected
      }
    }else{
      for(let i=0;i<this.envases.length;i++){
        this.Factura.productos.push(this.envases[i])
      }
      this.Factura.totales.push({lote:`${this.Lote}`,producto:`${this.Materia_prima_selected.nombre}`, marca:`${this.Materia_prima_selected.marca}`,total:this.total_kilos})
      this.Factura.condicion.push(this.condicion___)
    }
    
    this.Lote = null
    this.Materia_prima_selected = null;
    console.log(this.Factura)

  }


  cambiar_capacidad(){
    this.total_kilos = 0;
    for(let i=0;i<this.envases.length;i++){
      this.total_kilos = Number(this.total_kilos) + Number(this.envases[i].capacidad)
      this.total_kilos = Number(this.total_kilos.toFixed(2))
    }
  }

  finalizar_(){
    (<HTMLInputElement>document.getElementById('disabled_1')).disabled = false;
    (<HTMLInputElement>document.getElementById('disabled_2')).disabled = false;
    (<HTMLInputElement>document.getElementById('disabled_3')).disabled = false;
    (<HTMLInputElement>document.getElementById('disabled_4')).disabled = false;
    this.N_factura = ''
    this.N_OC = ''
    this.Transportista = '';
    (<HTMLInputElement>document.getElementById('disabled_4')).value = '#'
    this.Pedido[this.N_pedido].productos =  this.Factura.productos;
    this.Pedido[this.N_pedido].totales = this.Factura.totales
    this.Pedido[this.N_pedido].condicion = this.Factura.condicion
    this.NuevaRecepcion = false
    this.api.putFacturacion(this.Id, this.Pedido[this.N_pedido])
      .subscribe((resp:any)=>{
        this.Factura = null;
        this.Fabricantes_ = null
        this.Edicion = false;
        console.log(this.Pedido)
        this.BuscarFacturas();
      })
  }

  finalizar(){
    (<HTMLInputElement>document.getElementById('disabled_1')).disabled = false;
    (<HTMLInputElement>document.getElementById('disabled_2')).disabled = false;
    (<HTMLInputElement>document.getElementById('disabled_3')).disabled = false;
    (<HTMLInputElement>document.getElementById('disabled_4')).disabled = false;
    this.N_factura = ''
    this.N_OC = ''
    this.Transportista = '';
    (<HTMLInputElement>document.getElementById('disabled_4')).value = '#'
    this.api.postFacturacion(this.Factura)
    .subscribe((resp:any)=>{
        this.NuevaRecepcion = false
        this.Factura = null;
        this.Fabricantes_ = null
        this.BuscarFacturas();
      })
  }

  NuevaRecepcion_(){
    if(!this.NuevaRecepcion){
      this.NuevaRecepcion = true
    }else{
      this.NuevaRecepcion = false
    }
  }


  public Edicion:boolean = false;
  public N_pedido;
  public Id;
  EditarPedido(i){
    this.NuevaRecepcion_()
    console.log(this.Pedido[i])

    this.N_factura = this.Pedido[i].factura;
    this.N_OC = this.Pedido[i].orden;
    this.Transportista = this.Pedido[i].transportista;
    this.proveedor_selected = this.Pedido[i].proveedor;
    this.SeleccionarProveedor(this.Pedido[i].proveedor)
    this.Factura = {totales:[],productos:[],condicion:[]}
    this.Factura.productos = this.Pedido[i].productos
    this.Factura.condicion = this.Pedido[i].condicion
    for(let n=0; n<this.Pedido[i].totales.length;n++){

      this.Factura.totales.push(this.Pedido[i].totales[n])
    }
    this.N_pedido = i;
    this.Id = this.Pedido[i]._id
    this.Edicion = true;
  }



  
}

