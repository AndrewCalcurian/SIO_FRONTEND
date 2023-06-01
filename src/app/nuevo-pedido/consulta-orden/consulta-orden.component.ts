import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-consulta-orden',
  templateUrl: './consulta-orden.component.html',
  styleUrls: ['./consulta-orden.component.css']
})
export class ConsultaOrdenComponent implements OnInit {

  constructor(private api:RestApiService) { }

  ngOnInit(): void {
    this.api.getOrdenesDeCompra()
      .subscribe((resp:any)=>{
        this.Ordenes = resp
        console.log(this.Ordenes)
      })
  }

  public Ordenes = []
  public Orden;
  public selected = false;
  MostarOrden(e){
    console.log(e)
    this.Orden = this.Ordenes[e]
    this.selected = true;
  }
  puntoYcoma(n){
    if(!n){
      return 0
    }
    n = Number(n)
    return n = new Intl.NumberFormat('de-DE').format(n)
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
      })
  }

  edicionOC(){
    document.getElementById(`EditionForm`).style.display = 'block';
    document.getElementById(`okbutton`).style.display = 'block';
    document.getElementById(`editionButton`).style.display = 'none';
    document.getElementById(`Info__`).style.display = 'none';
    
  }

  listoOCEDIT(){
    this.api.putOrdenesDeCompra(this.Orden, this.Orden._id)
      .subscribe((resp:any)=>{
        document.getElementById(`EditionForm`).style.display = 'none';
        document.getElementById(`okbutton`).style.display = 'none';
        document.getElementById(`editionButton`).style.display = 'block';
        document.getElementById(`Info__`).style.display = 'block';
      })

  }

}
