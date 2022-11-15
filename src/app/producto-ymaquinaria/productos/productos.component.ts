import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscriber, timer } from 'rxjs';
import { SubirArchivosService } from 'src/app/services/subir-archivos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  baseUrl = environment.api

  public NUEVO_CLIENTE:boolean = false;
  public CLIENTES;
  public MATERIALES;
  public MATERIALES_NECESARIOS = [];
  public NUEVO_PRODUCTO:boolean = false;
  public GRUPOS;

  public ImageProducto;

  public EJEMPLARES = [];
  public POST = [];
  public TROQUEL

  public SECCIONES;

  public GRUPOS_MATERIA;

  public PRODUCTOS;
  public SUSTRATO = [];

  public Sus_Done:boolean = false;

  public dimensiones = []

  product_selected;
  _producto_seleccionado:boolean = false;

  montajes = 1;
  i_montajes = 0;
  i_montajes_ = 0;

  necesidad = 0;
  listo:boolean = true;
  
  cinco:boolean = true;
  seis:boolean = true;
  siete:boolean = true;
  ocho:boolean = true;

  public ImgSubir:File;


  almacenes = [];
  public new_almacen = ''
  public cargando = false;

  public VER_PRODUCTO:boolean = false;
  OneProduct:any = {producto:'',
                          cliente:{
                            nombre:'',
                            codigo:''
                          },
                          grupo:{_id:''},
                          codigo:'',
                          version:'',
                          ejemplares:[],
                          dimensiones:'',
                          fibra:'',
                          post:[],
                          sustrato:[{
                            nombre:'',
                            marca:'',
                            calibre:'',
                            gramaje:''
                          }],
                          materiales:[]};

  ClienteForm:FormGroup = this.fb.group({
    nombre:['',Validators.required],
    codigo:['',Validators.required],
    almacenes:['', Validators.required]
  })

  constructor(private api:RestApiService,
              private subirArchivo:SubirArchivosService,
              private fb:FormBuilder) { 
                this.usuario = api.usuario
              }

  ngOnInit(): void {
    this. obtenerGrupodeMateriales();
    this.BuscarGruposEnAlmacen();
    this.obtenerClientes();
    this.obtenerMateriales();
    this.obtenerGrupos();
    let cliente_id = (<HTMLInputElement>document.getElementById('cliente_Seleccionado')).value;
    // this.buscar_producto(cliente_id);
  }
  public usuario

  NumToLet(n){
    switch(n)
    {
        case 0: return "A";
        case 1: return "B";
        case 2: return "C";
        case 3: return "D";
        case 4: return "E";
        case 5: return "F";
        case 6: return "G";
        case 7: return "H";
        case 8: return "I";
    }

  }

  CambiarImagen( event:any ){
    this.ImgSubir = (event.target).files[0];
    document.getElementsByClassName('file-name')[0].innerHTML = this.ImgSubir.name;
  }

  subirImagen(){
    this.cargando = true;
    this.subirArchivo.actualizarFoto(this.ImgSubir, 'producto', this.OneProduct._id )
    .then(img => {
      if(img){
        this.usuario.img = img;
        document.getElementsByClassName('file-name')[0].innerHTML = 'Sin archivo...';
        this.ImgSubir = null;
      }
      this.verProducto(this.OneProduct._id)
      this.verProducto(this.OneProduct._id)
      this.cargando = false;
      });
  }

  producto_seleccionado(e){
    if(e === 0){
      this._producto_seleccionado = false;
    }else{
      this._producto_seleccionado = true;
      if(this.product_selected == 'Sustrato'){
        this._producto_seleccionado = false;
        document.getElementById('cant').hidden = true;
      }else{
        this._producto_seleccionado = true;
        document.getElementById('cant').hidden = false;
      }
    }
  }

  selecciona_producto(e){
    let clase = this.i_montajes.toString()
    if(e == 0){
      (<HTMLInputElement>document.getElementById(clase)).disabled = true;
    }else{
      (<HTMLInputElement>document.getElementById(clase)).disabled = false;
      this.product_selected = e;
      if(this.product_selected != 'Sustrato'){
        this.MATERIALES = [...this.MATERIALES.reduce((map, obj) => map.set(obj.nombre, obj), new Map()).values()];

      }
    }
  }

  selecciona_producto2(e){
    let clase = this.i_montajes_.toString()
    if(e == 0){
      (<HTMLInputElement>document.getElementById(`x-${clase}`)).disabled = true;
    }else{
      (<HTMLInputElement>document.getElementById(`x-${clase}`)).disabled = false;
      this.product_selected = e;
      if(this.product_selected != 'Sustrato'){
        this.MATERIALES = [...this.MATERIALES.reduce((map, obj) => map.set(obj.nombre, obj), new Map()).values()];

      }
    }
  }

  post_impresion(e){
    let Included = this.POST.includes(e);
    if(!Included){
      this.POST.push(e);
    }else{
      let i = this.POST.indexOf(e)
      this.POST.splice(i, 1)
    }

    // console.log(this.POST)
  }

  troquel(e){
    this.TROQUEL = e.target.value;
  }

  Ejemplar(e){
    if(!this.EJEMPLARES[this.i_montajes]){
      this.EJEMPLARES[this.i_montajes] = ''
    }
    this.EJEMPLARES[this.i_montajes] = e;
  }

  public Modal_Cliente(){
    if(this.NUEVO_CLIENTE){
      this.NUEVO_CLIENTE = false;
    }else{
      this.NUEVO_CLIENTE = true;
    }
  }

  public Modal_Producto(){
    if(this.NUEVO_PRODUCTO){
      this.NUEVO_PRODUCTO = false;
    }else{
      this.NUEVO_PRODUCTO = true;
    }
  }

  public ver_Modal_Producto(){
    if(this.VER_PRODUCTO){
      this.VER_PRODUCTO = false;
    }else{
      this.VER_PRODUCTO = true;
      this.i_montajes = 0;
      this.listo = true;
    }
  }

  sumaTintas(n){

    if(this.listo){
      this.listo = false;
      this.necesidad = n - 5;
      return n + Math.abs(this.necesidad);
    }else{
      return n + Math.abs(this.necesidad);
    }
  }

  cambiarCalculo(){
    this.listo = true;
  }

  add_almacen(){
    this.almacenes.push(this.new_almacen)
    this.new_almacen = ''
  }

  delete_this_almacen(i){
    let buscar = this.almacenes.find(x => x == i)
    let index = this.almacenes.indexOf(buscar)
    this.almacenes.splice(index,1)
  }

  enable(input){
    let campo = (<HTMLInputElement>document.getElementById(input)).disabled;

    if(campo){
      (<HTMLInputElement>document.getElementById(input)).disabled = false;
      (<HTMLInputElement>document.getElementById(input)).focus();
    } else {
      (<HTMLInputElement>document.getElementById(input)).disabled = true;
      let buscarSiExiste = this.MATERIALES_NECESARIOS.find(c => c.material == input);
      if(buscarSiExiste){
        let index = this.MATERIALES_NECESARIOS.indexOf(buscarSiExiste)
        this.MATERIALES_NECESARIOS.splice(index, 1)
      }
  }
}

just_a_sec(e){
  let nuevo = this.MATERIALES_NECESARIOS.find(c => c.material == e.target.id);
  let index;
  if(!nuevo){
    let data = {
      material:e.target.id,
      cantidad:e.target.value
    }

    this.MATERIALES_NECESARIOS.push(data)
  }else{
    index = this.MATERIALES_NECESARIOS.indexOf(nuevo)
    this.MATERIALES_NECESARIOS[index].cantidad = e.target.value
  }
}

  obtenerGrupodeMateriales(){
    this.api.GetGrupoMp()
      .subscribe((resp:any)=>{
        this.GRUPOS_MATERIA = resp;
      })
  }
  obtenerClientes(){
    this.api.GetClientes()
      .subscribe((resp:any) =>{
        this.CLIENTES = resp.clientes
      })
  }

  addCliente(){

    this.ClienteForm.get('almacenes').setValue(this.almacenes)

    if(this.ClienteForm.invalid) {
      Swal.fire({
        title:'Oops!',
        text:'Debes rellenar todos los campos para continuar',
        icon:'error',
        showConfirmButton:false,
        timer:1500
      })
      return;
    }
    

    this.api.PostClientes(this.ClienteForm.value)
        .subscribe((resp:any)=>{
          this.obtenerClientes();
          this.ClienteForm.reset();
          this.NUEVO_CLIENTE = false;
          this.almacenes = []
          Swal.fire({
            title:'Excelente!',
            text:'Se registro nuevo cliente',
            showConfirmButton:false,
            icon:'success',
            timer:2000
          })
        })
  }

  //--------------------- PRODUCTOS----

  obtenerMateriales(){
    this.api.getAlmacen()
      .subscribe((resp:any)=>{
        this.MATERIALES = resp.materiales
        // console.log(this.MATERIALES)
      })
  }

  obtenerGrupos(){
    this.api.getGrupos()
      .subscribe((resp:any)=>{
        this.GRUPOS = resp.grupos
        // console.log(this.GRUPOS,'GRUPOOOOS')
      })
  }

  Ordenar_Producto(){
    let valor = (<HTMLInputElement>document.getElementById('material_Necesario')).value
    let inde = this.MATERIALES_NECESARIOS.includes(valor);

    if(!inde){
      this.MATERIALES_NECESARIOS.push(valor)
    }

    
  }

  BuscarGruposEnAlmacen(){
    this.api.GetGrupoMp()
      .subscribe((resp:any)=>{
        this.SECCIONES = resp
        // alert('THIS IS WORKING')
        // console.log(this.SECCIONES,'SECCIONEEEES');
      })
  }

  finalizar(){

    // let name = (<HTMLInputElement>document.getElementById('sustrato_name')).value

    // let marca = (<HTMLInputElement>document.getElementById('sustrato_marca')).value
    // let gramaje = (<HTMLInputElement>document.getElementById('sustrato_gramaje')).value
    // let calibre = (<HTMLInputElement>document.getElementById('sustrato_calibre')).value

    // let sustrato = {
    //   nombre:name,
    //   marca,
    //   gramaje,
    //   calibre
    // }


    let data = {
      cliente: (<HTMLInputElement>document.getElementById('cliente_Seleccionado')).value,
      producto:(<HTMLInputElement>document.getElementById('nombre_nuevo_producto')).value,
      grupo:(<HTMLInputElement>document.getElementById('grupo_producto')).value,
      cod_cliente:(<HTMLInputElement>document.getElementById('cod_cliente')).value,
      materiales: this.MATERIALES_NECESARIOS,
      post:this.POST,
      ejemplares:this.EJEMPLARES,
      // sustrato: sustrato,
      codigo:(<HTMLInputElement>document.getElementById('cod_producto')).value,
      version:(<HTMLInputElement>document.getElementById('version')).value,
      edicion:(<HTMLInputElement>document.getElementById('edicion')).value,
      montajes:this.montajes
    }

    
    this.api.postProducto(data)
      .subscribe((resp:any)=>{
        this.Modal_Producto();
        let cliente_id = (<HTMLInputElement>document.getElementById('cliente_Seleccionado')).value;
        this.buscar_producto(cliente_id);
      })
  }

  ancho(e){
    let ancho = e.target.value;
    
    this.dimensiones.push(ancho);
    let tamano = this.dimensiones.length

    const largo = (<HTMLInputElement>document.getElementById('largo'))
    const DirFibra = (<HTMLInputElement>document.getElementById('d_fibra'))

    largo.disabled = false;

    if(ancho == ''){
      this.dimensiones = []

      largo.value = ''
      largo.disabled = true;
      DirFibra.disabled = true;
    }

    if(largo.value != ''){
      DirFibra.disabled = false
    }
    
  }

  largo(e){
    let largo = e.target.value;

    let tamano = this.dimensiones.length;
    
    const DirFibra = (<HTMLInputElement>document.getElementById('d_fibra'))
    
    if(largo == ''){
      this.dimensiones.pop();
      DirFibra.disabled = true;
    }
    
    if(largo != ''){
      if(tamano>1){
        this.dimensiones.pop();
      }
      this.dimensiones.push(largo);
      DirFibra.disabled = false;
    }
      // }else{
    //   DirFibra.disabled = false;
    // }


  }

  
  buscar_producto(e){
    this.api.getById(e)
      .subscribe((resp:any)=>{
        this.PRODUCTOS = resp.productos;
        // console.log(this.PRODUCTOS)
      });

      if(e == ""){
        (<HTMLInputElement>document.getElementById('NP_button')).disabled = true;
      }else{
        (<HTMLInputElement>document.getElementById('NP_button')).disabled = false;
      }
  }

  // sustratos(e){

  //   this.SUSTRATO = [];

  //   this.SUSTRATO.push(e.target.value);

  //   this.Sus_Done = true;

    
  // }
  NuevoSustrato(){
    this.SUSTRATO = [];
    this.Sus_Done = false;
  }

  add_materia2(producto, cantidad){

    let i = this.i_montajes.toString();

    producto = (<HTMLInputElement>document.getElementById(i)).value
    cantidad = (<HTMLInputElement>document.getElementById(`cantidad${this.i_montajes}`)).value

    let Material = this.MATERIALES.find(x => x._id === producto);

    // console.log(Material, '--' )

    let size = cantidad
    let name = Material.nombre

    if(this.product_selected == "Sustrato"){
      size = '0'
    }

    if(Material.ancho){
      name = `${Material.nombre} (${Material.ancho} x ${Material.largo})`;
    }

    let productos = {
      material:name,
      marca:Material.marca,
      producto:producto,
      cantidad: size
    }

    // console.log(productos);

    this.OneProduct.materiales[this.i_montajes].push(productos)
    // console.log(this.MATERIALES_NECESARIOS, 'this')
    // this.MATERIALES_NECESARIOS.push(productos);


    // let field_material = (<HTMLInputElement>document.getElementById('field_material'))
    // let field_marca = (<HTMLInputElement>document.getElementById('field_marca'))
    // let field_cantidad = (<HTMLInputElement>document.getElementById('field_cantidad'))

    // let new_material = {
    //   material:material.value,
    //   marca:marca.value,
    //   cantidad:cantidad.value
    // }

    // this.MATERIALES_NECESARIOS.push(new_material)

    // field_cantidad.value = '';
    // field_marca.value = '';
    // field_material.value = '';
  }

add_materia3(producto, cantidad){
  let i = this.i_montajes_.toString();

  producto = (<HTMLInputElement>document.getElementById(`x-${i}`)).value
  cantidad = (<HTMLInputElement>document.getElementById(`xcantidad${this.i_montajes_}`)).value


  let Material = this.MATERIALES.find(x => x._id == producto)


  // console.log(Material,'/*/*/*/*/*/*/*/*/*/*/*/')

  let size = cantidad
  let name = Material.nombre

  if(this.product_selected == "Sustrato"){
    size = '0'
  }

  if(Material.ancho){
    name = `${Material.nombre} (${Material.ancho} x ${Material.largo})`;
  }



  let productos = {
    material:name,
    marca:Material.marca,
    producto:producto,
    cantidad: size
  }

  if(!this.OneProduct.materiales[this.i_montajes_]){
    this.OneProduct.materiales[this.i_montajes_] = [];
  }
  
  this.OneProduct.materiales[this.i_montajes_].push(productos)

  this.api.updateProducto(this.OneProduct, this.OneProduct._id)
      .subscribe((resp:any)=>{
        // console.log(resp,'respuesta')
        this.editar(this.OneProduct)
        this.api.getOneById(this.OneProduct._id)
          .subscribe((resp:any)=>{
            // console.log('ok')
          })
          this.Modal_Producto_E()
          this.Modal_Producto_E()
      });
  
  
  
  

  // this.verProducto(producto)
}
  
add_materia(producto, cantidad){

    let i = this.i_montajes.toString();

    producto = (<HTMLInputElement>document.getElementById(i)).value
    cantidad = (<HTMLInputElement>document.getElementById(`cantidad${this.i_montajes}`)).value

    let Material = this.MATERIALES.find(x => x._id === producto);

    // console.log(Material, '--' )

    let size = cantidad
    let name = Material.nombre

    if(this.product_selected == "Sustrato"){
      size = '0'
    }

    if(Material.ancho){
      name = `${Material.nombre} (${Material.ancho} x ${Material.largo})`;
    }

    let productos = {
      material:name,
      marca:Material.marca,
      producto:producto,
      cantidad: size
    }

    // console.log(productos);
    if(!this.MATERIALES_NECESARIOS[this.i_montajes])
    { 
      this.MATERIALES_NECESARIOS[this.i_montajes] = []
    }

    this.MATERIALES_NECESARIOS[this.i_montajes].push(productos)
    // console.log(this.MATERIALES_NECESARIOS, 'this')
    // this.MATERIALES_NECESARIOS.push(productos);


    // let field_material = (<HTMLInputElement>document.getElementById('field_material'))
    // let field_marca = (<HTMLInputElement>document.getElementById('field_marca'))
    // let field_cantidad = (<HTMLInputElement>document.getElementById('field_cantidad'))

    // let new_material = {
    //   material:material.value,
    //   marca:marca.value,
    //   cantidad:cantidad.value
    // }

    // this.MATERIALES_NECESARIOS.push(new_material)

    // field_cantidad.value = '';
    // field_marca.value = '';
    // field_material.value = '';
  }

  Delete_Material(material2){

        let deleted = this.MATERIALES_NECESARIOS[this.i_montajes].findIndex(x => x.material == material2)

        // console.log(deleted)

        this.MATERIALES_NECESARIOS.splice(deleted, 1);
  }
  Delete_Material2(material2){

    // console.log(this.OneProduct.materiales[this.i_montajes])
    let deleted = this.OneProduct.materiales[this.i_montajes_].findIndex(x => x.producto.nombre == material2)
    // console.log(deleted)

    this.OneProduct.materiales[this.i_montajes_].splice(deleted, 1);

    // let deleted = this.OneProduct.materiales[this.i_montajes].producto.findIndex(x => x.nombre == material2)

    // // console.log(deleted)

    // this.MATERIALES_NECESARIOS.splice(deleted, 1);
}

  borrarPost(post){
    let i = this.POST.indexOf(post)

    this.POST.splice(i, 1)
  }

  borrarPost2(post){
    let i = this.OneProduct.post.indexOf(post)

    // console.log(i)

    this.POST.splice(i, 1)
  }

  editar_producto(){
    
    this.api.updateProducto(this.OneProduct, this.OneProduct._id)
      .subscribe((resp:any)=>{
        Swal.fire({
          title:'Producto editado con exito!',
          icon:'success',
          showConfirmButton:false
        })
        this.editar(this.OneProduct)
        this.buscar_producto(this.OneProduct.cliente._id)
        this.Modal_Producto_E()
      });
  }

  verProducto(producto){

    this.api.getOneById(producto)
      .subscribe((resp:any)=>{
        this.OneProduct = resp.producto

        if( this.OneProduct.img) {
          this.ImageProducto =  `${this.baseUrl}/imagen/producto/${this.OneProduct.img}`;
        }else{
          this.ImageProducto = `../../../assets/no-picture.png`;
        }

        this.ver_Modal_Producto()
      })
  }
  public EDITAR_PRODUCTO:boolean = false;
  Modal_Producto_E(){
    if(this.EDITAR_PRODUCTO){
      this.EDITAR_PRODUCTO = false
    }else{
      this.EDITAR_PRODUCTO = true
      this.EDITAR_PRODUCTO = false
      if(this.OneProduct.materiales[this.i_montajes_].length > 0){
        this.EDITAR_PRODUCTO = true
      }
    }
  }

  editar(producto){
    this.api.getOneById(producto)
      .subscribe((resp:any)=>{
        this.OneProduct = resp.producto;
        // console.log('AQUIIIIIIIIIIIIII', this.OneProduct);
      })
      if(this.OneProduct){
        this.Modal_Producto_E();
      }
  }


}
