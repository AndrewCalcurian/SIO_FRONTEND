import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-repuestos',
  templateUrl: './repuestos.component.html',
  styleUrls: ['./repuestos.component.css']
})
export class RepuestosComponent implements OnInit {

  constructor(public api:RestApiService) { }

  public Maquinas
  public Categoria = false;
  public Categorias = [];
  public Repuesto = false;
  public Repuestos = []
  public Almacen = false;
  public Almacenes = [];

  public Mostrar_registro = false;

  public equis = [];
  public ye = [];
  public edicion = false;

  public nuevoMaterial = {
    maquina: '',
    categoria: '',
    nombre: '',
    parte:'',
    foto:''
  }
  public Almacen__ = {
    maquina : '',
    categoria: '',
    repuesto: '',
    fecha:'',
    proveedor:'',
    factura:'',
    precio:'',
    ubicacion:'',
    cantidad: 0
  }


  ngOnInit(): void {
    this.buscarMaquinas();
    this.buscarCategorias();
    this.buscarRepuestos();
    this.buscarPiezas();
  }

  NuevaPieza(){
    this.Almacen = true;
    this.Almacen__ = {
    maquina : '',
    categoria: '',
    repuesto: '',
    fecha:'',
    proveedor:'',
    factura:'',
    precio:'',
    ubicacion:'',
    cantidad: 0
  } 
  }


  cerrarRegistro(){
    this.Repuesto = false;
    this.edicion = false
  }
  

  editar(repuesto){
    this.nuevoMaterial = repuesto;
    this.edicion = true;
    this.Repuesto = true;
  }

  editarPieza(pieza){
    this.Almacen__ = pieza;
    this.edicion = true;
    this.Almacen = true;
  }

  showInfo(x,y){
    if(this.equis[x] && this.ye[y]){
      this.equis[x] = false;
      this.ye[y] = false
    }else{
      this.equis[x] = true;
      this.ye[y] = true
    }
  }

  changeBeta(){
    if(this.Mostrar_registro){
      this.Mostrar_registro = false
    }else{
      this.Mostrar_registro = true
    }
  }

  buscarPiezas(){
    this.api.getpieza()
      .subscribe((resp:any) =>{
        this.Almacenes = resp.pieza
        console.log(this.Almacenes);
        
      })
  }

  buscarRepuestos(){
    this.api.getRepuesto()
        .subscribe((resp:any)=>{
          this.Repuestos = resp.repuesto;
        })
  }

  buscarCategorias(){
    this.api.getCategorias()
        .subscribe((resp:any)=>{
          this.Categorias = resp.categorias;
          
        })
  }

  verImagen(foto, nombre){

    if(!foto){
      foto = 'no-image'
    }
    Swal.fire({
      title: nombre,
      imageUrl: `http://192.168.0.23:8080/api/imagen/repuestos/${foto}`,
      imageWidth: 400,
      imageAlt:nombre,
      showConfirmButton:false
    });
  }

  buscarMaquinas(){
    this.api.GetMaquinas()
      .subscribe((resp:any)=>{
        this.Maquinas = resp;
        const maquinas = this.Maquinas;
        const maquinasUnicas = maquinas.reduce((acc, maquina) => {
        if (!acc.find((m) => m.nombre === maquina.nombre)) {
          acc.push(maquina);
        }
        return acc;
        }, []);
          this.Maquinas = maquinasUnicas;
      })
  }

  AbrirCategorias(){
    
    this.Categoria = true
    console.log(this.Categoria);
  }

  NuevoRepuesto(){
    this.nuevoMaterial = {
      maquina: '',
      categoria: '',
      nombre: '',
      parte:'',
      foto:''
    }
    this.Repuesto = true;
    this.buscarMaquinas();
    this.buscarCategorias();
    this.buscarRepuestos();
  }

  hasMatchingRepuesto(maquinaId: string, categoriaId: string): boolean {
    return this.Repuestos.some(repuesto => repuesto.maquina == maquinaId && repuesto.categoria == categoriaId);
  }

  hasMatchingRepuesto2(maquinaId: string, categoriaId: string): boolean {
    return this.Almacenes.some(repuesto => repuesto.maquina == maquinaId && repuesto.categoria == categoriaId);
  }

  cerrarPiezas(){
    this.Almacen = false;
    this.edicion = false;
    this.buscarMaquinas();
    this.buscarCategorias();
    this.buscarRepuestos();
  }
  

}
