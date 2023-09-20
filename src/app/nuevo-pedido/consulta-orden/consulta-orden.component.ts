import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-orden',
  templateUrl: './consulta-orden.component.html',
  styleUrls: ['./consulta-orden.component.css']
})
export class ConsultaOrdenComponent implements OnInit {

  constructor(private api:RestApiService) { }

  ngOnInit(): void {
    this.GetOrdens()
  }

  public Ordenes = []
  public Orden;
  public selected = false;
  public all_ = false;
  public PRODUCTO = []

  GetOrdens(){
    this.api.getOrdenesDeCompra()
      .subscribe((resp:any)=>{
        this.Ordenes = resp
        console.log(this.Ordenes)
      })
  }
  MostarOrden(e){
    if(e != 'all'){
      console.log(e)
      this.all_ = false;
      this.Orden = this.Ordenes[e]
      this.selected = true;
    }else if(e === 'all'){
      this.all_ = true;
    }
  }
  puntoYcoma(n){
    if(!n){
      return 0
    }
    n = Number(n)
    return n = new Intl.NumberFormat('de-DE').format(n)
  }

  BuscarProductos(id){
    this.api.getById(id)
        .subscribe((resp:any)=>{
          this.PRODUCTOS = resp.productos;
          // // console.log(this.PRODUCTOS)
      })
  }

  public producto__;
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

  public _CANTIDAD = ''
  NuevaCantidad(e){
    this._CANTIDAD = e
  }

  public __Fecha = ''
  Fecha__(e){
    this.__Fecha = e
  }

  public PRODUCTOS = [];
  Edicion(i){
    document.getElementById(`status_${i}`).style.width = '1px';
    document.getElementById(`cantidad_${i}`).style.display = 'none';
    document.getElementById(`fecha_${i}`).style.display = 'none';
    document.getElementById(`edit_${i}`).style.display = 'none';
    // document.getElementById(`dele_${i}`).style.display = 'none';
    document.getElementById(`producto_${i}`).style.display = 'none'
    document.getElementById(`cantidad__${i}`).style.display = 'block';
    document.getElementById(`fecha__${i}`).style.display = 'block';
    document.getElementById(`producto__${i}`).style.display = 'block';
    document.getElementById(`listo_${i}`).style.display = 'block';
    this.api.getById(this.Orden.cliente._id)
      .subscribe((resp:any)=>{
        this.PRODUCTOS = resp.productos
        console.log(this.PRODUCTOS)
      })
  }

  Terminar( i){
    this.api.putOrdenesDeCompra(this.Orden, this.Orden._id)
      .subscribe((resp:any)=>{
        document.getElementById(`status_${i}`).style.width = '150px';
    document.getElementById(`cantidad_${i}`).style.display = 'block';
    document.getElementById(`fecha_${i}`).style.display = 'block';
    document.getElementById(`edit_${i}`).style.display = 'block';
    // document.getElementById(`dele_${i}`).style.display = 'block';
    document.getElementById(`producto_${i}`).style.display = 'block'
    document.getElementById(`cantidad__${i}`).style.display = 'none';
    document.getElementById(`fecha__${i}`).style.display = 'none';
    document.getElementById(`producto__${i}`).style.display = 'none';
    document.getElementById(`listo_${i}`).style.display = 'none';

    Swal.fire({
      title:'Orden editada con exito!',
      icon:'success',
      showConfirmButton:false,
      timerProgressBar:true,
      toast:true,
      timer:2000,
      position:'top-end'
    })
      })
  }
  
  AgregarNuevo(){
    let id = this.Orden._id
    console.log(this.Orden)
    this.Orden.productos.push(
      {
        producto:this.PRODUCTO,
        nombre:this.producto__,
        cantidad:this._CANTIDAD,
        fecha:this.__Fecha
      })
      
      this.__Fecha = ''
      this._CANTIDAD = ''
      this.PRODUCTO = []
      this.listoOCEDIT()
      this.GetOrdens()
      setTimeout(()=> {
        let index = this.Ordenes.findIndex(x=> x._id === id)
        this.MostarOrden(index)
      },1000)

  }

  edicionOC(){
    document.getElementById(`EditionForm`).style.display = 'block';
    document.getElementById('addprod').style.display = 'block';
    document.getElementById(`okbutton`).style.display = 'block';
    document.getElementById(`editionButton`).style.display = 'none';
    document.getElementById(`Info__`).style.display = 'none';
    this.api.getById(this.Orden.cliente._id)
      .subscribe((resp:any)=>{
        this.PRODUCTOS = resp.productos
        console.log(this.PRODUCTOS)
      })
  }

  listoOCEDIT(){
    this.api.putOrdenesDeCompra(this.Orden, this.Orden._id)
      .subscribe((resp:any)=>{
        document.getElementById(`EditionForm`).style.display = 'none';
        document.getElementById('addprod').style.display = 'none';
        document.getElementById(`okbutton`).style.display = 'none';
        document.getElementById(`editionButton`).style.display = 'block';
        document.getElementById(`Info__`).style.display = 'block';
      })

  }

}
