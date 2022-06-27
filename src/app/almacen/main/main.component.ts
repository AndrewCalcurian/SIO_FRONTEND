import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/rest-api.service';
import { PdfMakeWrapper, Txt, Img, Table, Cell, Columns, Stack } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as moment from 'moment';

import Swal from 'sweetalert2';




@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  fileName= 'ExcelSheet.xlsx';

  public resumido:boolean = false;
  public detallado:boolean = true;

  public NUEVO_PRODUCTO:boolean = false;
  public ALMACEN;
  public SECCIONES

  public PESO= 0
  public GRAMAJE = 300
  public ANCHO= 0
  public LARGO= 0
  public HOJAS = 0

  public PESO_= 0
  public GRAMAJE_ = 300
  public ANCHO_= 0
  public LARGO_= 0
  public HOJAS_ = 0

  empty:boolean = true;

  public OTRO:boolean = true;
  public Gs;

  public CONVERSION:boolean = false;
  public BOBINAS:boolean = false;
  public CONSULTAB:boolean = false;

  public BOBINAS_;
  public product_selected;
  public _producto_seleccionado;

  public boolean_sustrato:boolean = false;
  public Sustratos;

  public New_Sustrato:boolean = false;

  public Mat_Selected;
  public Num_Bobina

  public MATERIALES_NECESARIOS:boolean = false;
  public _NUEVO_PRODUCTO:boolean = false;
  public EDICION_ALMACEN:boolean = false;

  public DESCUENTOS = [];

  public name_p_e
  public cantidad_p_e
  public id_p_e
  public eliminacion:boolean = false;
  public eliminar_sustrato:boolean = false;

  public reporte:boolean = false;


  public AlmacenadoId;
  public MaterialID;

  public loading:boolean = true;

  public _bobina:boolean = false;
  public descontar_b:boolean = false;

  codigoID = '';
  loteID = '';
  cantidadID = '';

  codigo = '';
  lote = '';
  cantidad = '';

  public New_color:boolean = false;
  public caja_:boolean = false;

  solicitud:boolean = false;
  asignacion:boolean = false;
  confirmacion:boolean = false;



  public _Almacenado:boolean = true;
  public Editar_NUEVO_PRODUCTO:boolean = false;

  public TOTALES = [
    {
      material:null,
      marca:null,
      calibre:null,
      gramaje:null,
      total:null,
      grupo:null,
      presentacion:null,
      neto:null,
      unidad:null,
      ancho:null,
      largo:null
    }
  ];

  public _bobina_ = ''
  

  public Almacenado = [];
  Pendiente;


  InventarioForm:FormGroup = this.fb.group({
    ancho:[''],
    largo:[''],
    gramaje:[''],
    calibre:[''],
    producto:['', Validators.required],
    marca:['',Validators.required],
    presentacion:['', Validators.required],
    unidad:['',Validators.required],
    neto:['', Validators.required],
    color:['Negro',Validators.required],
    cinta:[''],
    // codigo:['',Validators.required],
    // cantidad:['', Validators.required],
    // lote:['', Validators.required],
    NewControl:['']
  });

  BobinaForm:FormGroup = this.fb.group({
    Nbobina:['', Validators.required],
    material:['CARTON REV. BLANCO', Validators.required],
    gramaje:['', Validators.required],
    ancho:['', Validators.required],
    peso:['', Validators.required],
    lote:['', Validators.required],
    convertidora:['',Validators.required]
  });


  constructor(private fb:FormBuilder,
              private api:RestApiService) { 
                this.usuario = api.usuario;
              }


  ngOnInit(): void {
    this.BuscarAlmacen();
    this.getAalmacenado();
    this.BuscarGruposEnAlmacen();
    // this.getSustratos();
    this.porConfirmar();
    this.totalizar_materiales()
    this.Gs = (<HTMLInputElement>document.getElementById('selected')).value
    this.Buscar_conversiones()
    this.getbobinas();
    this.getOrdenes();
    this.buscarPendientes();
  }

  public usuario

  public orden;
  getOrdenes(){
    this.api.getOrden()
    .subscribe( (resp:any) => {
      this.orden = resp;
    } )

  }

  buscarPendientes(){
    this.api.getRequiEspera()
      .subscribe((resp:any)=>{
        this.Pendiente = resp;
      })
  }


  Requisicion(){
    this.confirmacion = true
  }

  showOrden(){
    console.log(this.orden)
  }

  agregarRequisicion(e){
    this.necesario.push(e)
  }

  public necesario;

  porConfirmar(){
    this.api.getMaterialesPorConfirmar()
      .subscribe((resp:any)=>{
        this.necesario = resp;
      })
  }

  define_color(e){
    if(e != 'Pantone'){
      this.InventarioForm.get('color').setValue(e);
      (<HTMLInputElement>document.getElementById('color')).value = e;
    }else{
      (<HTMLInputElement>document.getElementById('color')).value = '';
      (<HTMLInputElement>document.getElementById('color')).disabled = false;
    }
  }

  Modal_Almacen_ep(){
    if(this.Editar_NUEVO_PRODUCTO){
      this.Editar_NUEVO_PRODUCTO = false;
    }else{
      this.Editar_NUEVO_PRODUCTO = true;
    }
  }

  modal_solicitud(){
    if(this.solicitud){
      this.solicitud = false
    }else{
      this.solicitud = true
    }
  }
  modal_asignacion(){
    if(this.asignacion){
      this.asignacion = false
    }else{
      this.asignacion = true
    }
  }

  existencia_(seccion){

    let existencia = this.Almacenado.find(x => x.material.grupo.nombre === seccion)

    if(existencia){
      return true
    }else{
      return false
    }

  }

  public _sustratos_ = []
  buscarSustratos(){
    let sustratos = this.ALMACEN.filter(x => x.grupo.nombre == 'Sustrato')
    for(let i=0; i<sustratos.length; i++){
      let sustrato = this._sustratos_.find(x=> x == sustratos[i].nombre);
      if(!sustrato){
        this._sustratos_.push(sustratos[i].nombre)
      }
    }
  }

  public _gramajes_ = []
  buscarGramaje(e){
    this._gramajes_ = []
    let sustratos = this.ALMACEN.filter(x => x.nombre == e)
    // console.log(sustratos,'15515151515151515151515151515151')
    for(let i=0; i<sustratos.length; i++){
      let gramaje = this._gramajes_.find(x=> x.gramaje == sustratos[i].gramaje);
      if(!gramaje){
        this._gramajes_.push(sustratos[i])
        }
    }
    console.log(this._gramajes_,'GRAMAGRAMAGRAMA')
  }

  public _ancho_ = []
  buscarAncho(e){
    this._ancho_ = []
    let sustratos = this.ALMACEN.filter(x => x.gramaje == e)
    for(let i=0; i<sustratos.length; i++){
      let ancho = this._ancho_.find(x=> x.ancho == sustratos[i].ancho);
      if(!ancho){
        this._ancho_.push(sustratos[i])
        }
    }
  }

  define_color2(e){
    if(e != 'Pantone'){
      this.MaterialID.color = e;
    }else{
      (<HTMLInputElement>document.getElementById('color')).disabled = false;
      (<HTMLInputElement>document.getElementById('color')).value = '';
    }
  }

  Editar_2(id){
    this.Modal_Almacen_ep()
    this.api.getMaterialesID(id)
      .subscribe((resp:any)=>{
        this.MaterialID = resp;
        if(resp.grupo.nombre === 'Tinta'){
          this.New_color = true;
        }
        if(resp.grupo.nombre === 'Cajas Corrugadas'){
          this.caja_ = true;
        }
        console.log(this.MaterialID,'ok')
      })
  }

  Editar_Material_F(){
    let grupo = this.MaterialID.grupo._id;

    this.MaterialID.grupo = grupo;

    console.log(this.MaterialID)

    this.api.putMaterialID(this.MaterialID._id, this.MaterialID)
          .subscribe((resp:any)=>{
            this.Modal_Almacen_ep();
            this.getAalmacenado();
                this.BuscarAlmacen();
                this.totalizar_materiales();
                Swal.fire({
                  position:'center',
                  icon:'success',
                  title:'Material editado con exito!',
                  showConfirmButton: false,
                  timer:1500
                })

          })
  }

  Editar(id){
    this.edit_almacen()
    this.api.getAlmacenadoID(id)
      .subscribe((resp:any)=>{
        this.AlmacenadoId = resp;
        this.selecciona_producto(this.AlmacenadoId.material.grupo.nombre)
        this.codigoID = this.AlmacenadoId.codigo;
        this.loteID = this.AlmacenadoId.lote;
        this.cantidadID = this.AlmacenadoId.cantidad;

      })
  }

  _Editar(producto){
    let body = {
      material:this.AlmacenadoId.material._id,
      codigo:this.codigoID,
      lote:this.loteID,
      cantidad:this.cantidadID

      
    }
    
    this.api.putAlmacenadoID(this.AlmacenadoId._id, body)
    .subscribe((resp:any)=>{
      this.edit_almacen();
      Swal.fire({
        position:'center',
        icon:'success',
        title:'El inventario fue editado con exito',
        showConfirmButton: false,
        timer:1500
      })
      this.getAalmacenado();
      this.BuscarAlmacen();
      this.totalizar_materiales();
      this.codigoID = ''
      this.loteID = ''
      this.cantidadID = ''
      this.AlmacenadoId = ''
    })
    
  }
  
  public edit_almacen(){
    if(this.EDICION_ALMACEN){
      this.EDICION_ALMACEN = false;
    }else{
      this.EDICION_ALMACEN = true;
    }
  }

  Almacenes(e){
    if(e == 'Almacenada'){
      this._Almacenado = true;
      this._bobina = false;
    }else if(e == 'Bobinas'){
      this._Almacenado = false;
      this._bobina = true;
    }else{
      this._Almacenado = false;
      this._bobina = false;
    }
  }

  getAalmacenado(){
    this.api.getAlmacenado()
      .subscribe((resp:any)=>{
        this.Almacenado = resp;
        this.totalizar_materiales();
      })
  }

  Cambio_opciones(e){
    if(e === 'otros'){
      this.OTRO = true
    }else{
      this.OTRO = false;
      this.Gs = e;
    }

    if(e === '61f92a1f2126d717f004cca6'){
      this.New_Sustrato = true;
    }else{
      this.New_Sustrato = false;
    }

    if(e === '61fd54e2d9115415a4416f17'){
      this.New_color = true;
    }else{
      this.New_color = false;
    }

    if(e === '61fd7a8ed9115415a4416f74'){
      this.caja_ = true;
    }else{
      this.caja_ = false
    }

  }

  public Edition__ = '';
  public Edition__2 = '';

  public Nuevo_producto(){
    if(this._NUEVO_PRODUCTO){
      this._NUEVO_PRODUCTO = false;
    }else{
      this._NUEVO_PRODUCTO = true;
    }

  }

  public Modal_Almacen(){
    if(this.NUEVO_PRODUCTO){
      this.NUEVO_PRODUCTO = false;
    }else{
      this.NUEVO_PRODUCTO = true;
    }
  }

  public Modal_bobinas(){
    if(this.BOBINAS){
      this.BOBINAS = false;
    }else{
      this.BOBINAS = true;
      this.buscarSustratos()
    }
  }

  public modal_Conversion(){
    if(this.CONVERSION){
      this.CONVERSION = false;
    }else{
      this.CONVERSION = true;
    }
  }

  public modal_reporte(){
    if(this.reporte){
      this.reporte = false;
    }else{
      this.reporte = true;
    }
  }

  public check_bobinas(){
    if(this.CONSULTAB){
      this.CONSULTAB = false;
    }else{
      this.CONSULTAB = true;
    }
  }

  public bobina__;
  descontar_bobina(bobina?){
    if(this.descontar_b){
      this.descontar_b = false;
    }else{
      this.descontar_b = true;
      this.bobina__ = bobina;
    }
  }
  descontar_bobina_(numero){
    let data = {
      bobina:this.bobina__,
      numero
    }
    this.api.deleteBobina(data)
      .subscribe((resp:any)=>{
        Swal.fire({
          text:resp,
          icon:'info',
          showConfirmButton:false
        });
        this.getbobinas();
        this.descontar_bobina();
        this.Buscar_conversiones();
      })
  }

  BuscarGruposEnAlmacen(){
    this.loading = true;
    this.api.GetGrupoMp()
      .subscribe((resp:any)=>{
        this.SECCIONES = resp
        this.loading = false;
      })
  }

  BuscarAlmacen(){
    this.loading = true;
    this.api.getAlmacen()
      .subscribe((resp:any) => {
        this.ALMACEN = resp.materiales;
        this.totalizar_materiales()
        this.loading = false;
      })
  }


  selecciona_producto(e){
    if(e == 0){
      (<HTMLInputElement>document.getElementById('Producto_select')).disabled = true;
    }else{
      (<HTMLInputElement>document.getElementById('Producto_select')).disabled = false;
      this.product_selected = e;
    }
  }

  almacenar(producto){
    let data = {
      material:producto.value,
      codigo:this.codigo,
      lote:this.lote,
      cantidad:this.cantidad
    }

    this.api.postAlmacenado(data)
      .subscribe((resp:any)=>{
        Swal.fire({
          position:'center',
          icon:'success',
          title:'Nueva materia prima agregada',
          showConfirmButton: false,
          timer:1500
        })
        this.Nuevo_producto();
        this.BuscarAlmacen();
        this.getAalmacenado();
        this.codigo = '';
        this.lote = '';
        this.cantidad ='';
        (<HTMLInputElement>document.getElementById('Nuevoproducto')).value = "0";
      })
  }

  producto_seleccionado(e){
    if(e == 0){
      this._producto_seleccionado = false
      this.codigo = '';
      this.lote = '';
      this.cantidad = '';
    }else{
      this._producto_seleccionado = true
    }
  }
  

  Almacenar(){

    let grupo;

    if(this.OTRO){
    grupo = this.InventarioForm.get('NewControl').value
    }
    else{
      grupo = this.Gs;
    }


    const data = {
      producto: this.InventarioForm.get('producto').value,
      marca:this.InventarioForm.get('marca').value,

      ancho:this.InventarioForm.get('ancho').value,
      largo:this.InventarioForm.get('largo').value,
      gramaje:this.InventarioForm.get('gramaje').value,
      calibre:this.InventarioForm.get('calibre').value,


      // cantidad: this.InventarioForm.get('cantidad').value,
      unidad: this.InventarioForm.get('unidad').value,
      presentacion: this.InventarioForm.get('presentacion').value,
      neto: this.InventarioForm.get('neto').value,
      color:this.InventarioForm.get('color').value,
      // codigo: this.InventarioForm.get('codigo').value,
      // lote: this.InventarioForm.get('lote').value,
      cinta:this.InventarioForm.get('cinta').value,
      grupo,
      nuevo:this.OTRO

    }

    console.log(this.InventarioForm.get('color').value)

    if(this.InventarioForm.invalid){
      return
    }



    this.api.PostAlmacen(data)
     .subscribe(resp=>{
        this.InventarioForm.reset();
        this.BuscarAlmacen();
        this.BuscarGruposEnAlmacen();
        this.Modal_Almacen();
        // this.getSustratos();
      })

   }

   Peso(e){
    this.PESO = e.target.value
    this.HOJAS = this.PESO*10000000000
    let otro = this.GRAMAJE*this.ANCHO*this.LARGO
    this.HOJAS = this.HOJAS/otro
    this.HOJAS = Math.trunc(this.HOJAS)
    // /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Gramaje(e){
     this.GRAMAJE = e
     this.HOJAS = this.PESO*10000000000
     let otro = this.GRAMAJE*this.ANCHO*this.LARGO
     this.HOJAS = this.HOJAS/otro
     this.HOJAS = Math.trunc(this.HOJAS)
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Ancho(e){
     this.ANCHO = e
     this.HOJAS = this.PESO*10000000000
     let otro = this.GRAMAJE*this.ANCHO*this.LARGO
     this.HOJAS = this.HOJAS/otro
     this.HOJAS = Math.trunc(this.HOJAS)
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Largo(e){
     this.LARGO = e
     this.HOJAS = this.PESO*10000000000
     let otro = this.GRAMAJE*this.ANCHO*this.LARGO
     this.HOJAS = this.HOJAS/otro
     this.HOJAS = Math.trunc(this.HOJAS)
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }

  //  ***********************************************************
  Hojas_(e){
    this.HOJAS_ = e.target.value
    let all = this.HOJAS_ * this.GRAMAJE_*this.ANCHO_*this.LARGO_
    this.PESO_ = all / 10000000000;
    // /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Gramaje_(e){
     this.GRAMAJE_ = e.target.value
     let all = this.HOJAS_ * this.GRAMAJE_*this.ANCHO_*this.LARGO_
     this.PESO_ = all / 10000000000;
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Ancho_(e){
     this.ANCHO_ = e.target.value
     let all = this.HOJAS_ * this.GRAMAJE_*this.ANCHO_*this.LARGO_
     this.PESO_ = all / 10000000000;
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Largo_(e){
     this.LARGO_ = e.target.value
     let all = this.HOJAS_ * this.GRAMAJE_*this.ANCHO_*this.LARGO_
     this.PESO_ = all / 10000000000;
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
  //  ***********************************************************


  nuevaBobina(){
    this.api.postNuevaBobina(this.BobinaForm.value)
      .subscribe((resp:any)=>{
        this.BobinaForm.reset();
        this.Modal_bobinas();
        this.getbobinas();
        Swal.fire({
          title:'Nueva Bobina Agregada!',
          text:'Se agregó una nueva bobina al almacen de bobinas',
          icon:'success',
          showConfirmButton:false
        })
      })
  }

  public SUSTRATO_CONVERSION = [];

  getbobinas(){
    this.api.getBobina()
      .subscribe((resp:any)=>{
        this.BOBINAS_ = resp;
        for(let i = 0; i<this.BOBINAS_.length; i++){
          let bobina = this.BOBINAS_[i]
          // bobinas
          // material
          // ancho
          // largo
          
          // material 
          // nombre
          // ancho
          // largo 

          let sustrato = this.ALMACEN.filter(x => x.nombre == bobina.material && x.gramaje == bobina.gramaje && x.ancho == bobina.ancho)
          if(sustrato){
            this.SUSTRATO_CONVERSION.push(sustrato)
          }
        }
      })
  }


  public conversiones = []
  Buscar_conversiones(){
    this.api.getConversiones()
      .subscribe((resp:any)=>{
        this.conversiones = resp;
      })
  }

  Buscar_Bobina(e){
    let material = this.ALMACEN.find(x => x._id == e.target.value)

    if(material){
      (<HTMLInputElement>document.getElementById('_gramaje')).value = material.gramaje;
      (<HTMLInputElement>document.getElementById('_ancho')).value = material.ancho;
      (<HTMLInputElement>document.getElementById('_largo')).value = material.largo;
      this.Gramaje(material.gramaje);
      this.Ancho(material.ancho);
      this.Largo(material.largo);
      // if(TheBobina){
      // (<HTMLInputElement>document.getElementById('_ancho')).value = TheBobina.ancho
      // }
      // if(TheBobina){
      //   console.log(TheBobina)
      //   this.Mat_Selected = TheBobina.material;
      //   this.Num_Bobina = TheBobina.Nbobina;
      // }
    }

  }

  Generar_Conversion(){
    let sustrato = (<HTMLInputElement>document.getElementById('bobina_selected')).value;
    let peso = (<HTMLInputElement>document.getElementById('_peso')).value;
    let gramaje = (<HTMLInputElement>document.getElementById('_gramaje')).value;
    let ancho = (<HTMLInputElement>document.getElementById('_ancho')).value;
    let largo = (<HTMLInputElement>document.getElementById('_largo')).value;
    let observacion = (<HTMLInputElement>document.getElementById('observacion')).value;
    let convertidora = (<HTMLInputElement>document.getElementById('convertidora')).value;

    let Material = this.ALMACEN.find(x=> x._id == sustrato)

    let data = {
      material:Material.nombre,
      codigo:this.Num_Bobina,
      peso,
      sustrato:Material.nombre,
      hojas:this.HOJAS,
    }

    let solicitado = [
      'Jaime San Juan',
      'Gerente de Operaciones',
      'Poligráfica Industrial, C.A.'
    ]

    let hojas:string = data.hojas.toString()

    let hoy = moment().format('DD/MM/YYYY')

     this.api.postNuevoSustrato(data)
       .subscribe((resp:any)=>{
         this.modal_Conversion();
         Swal.fire({
           title:'Nueva Solicitud de Conversion Creada',
           text:`Su solicitud de conversion para ${Material.nombre}, fue realizada`,
           icon:'success',
           showConfirmButton:false,
         })

        async function recibo() {
          const pdf = new PdfMakeWrapper();
          PdfMakeWrapper.setFonts(pdfFonts);
          pdf.pageOrientation('landscape');


          pdf.add(
            new Table([
              [
                new Cell(await new Img('../../assets/poli_cintillo.png').width(85).margin([35, 5]).build()).rowSpan(4).end,
                new Cell(new Txt(`
                SOLICITUD DE CONVERSIÓN`).bold().end).alignment('center').fontSize(13).rowSpan(4).end,
                new Cell(new Txt('Código: FAL-002').end).fillColor('#dedede').fontSize(9).alignment('center').end,
              ],
              [
                new Cell(new Txt('').end).end,
                new Cell(new Txt('').end).end,
                new Cell(new Txt('N° de Revisión: 0').end).fillColor('#dedede').fontSize(9).alignment('center').end,
              ],
              [
                new Cell(new Txt('').end).end,
                new Cell(new Txt('').end).end,
                new Cell(new Txt('Fecha de Revision: 18/03/2022').end).fillColor('#dedede').fontSize(9).alignment('center').end,
              ],
              [
                new Cell(new Txt('').end).end,
                new Cell(new Txt('').end).end,
                new Cell(new Txt('Página: 1 de 1').end).fillColor('#dedede').fontSize(9).alignment('center').end,
              ],
            ]).widths(['25%','50%','25%']).end
          )

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell(new Table(([
                  [
                    new Cell(new Txt('CONVERTIDORA').end).fillColor('#dedede').end,
                    new Cell(new Txt(convertidora).end).end,
                  ]
                ])
                ).widths(['30%','70%']).end
                ).alignment('center').end,

                new Cell(new Txt('').end).end,

                new Cell(new Table(([
                  [
                    new Cell(new Txt('CONVERSIÓN').end).alignment('center').colSpan(2).color('#ffffff').fillColor('#000000').end,
                    new Cell(new Txt('').end).end
                  ],
                  [
                    new Cell(new Txt('N°').margin([0,6]).end).alignment('center').fillColor('#dedede').end,
                    new Cell(new Txt(resp).bold().end).fontSize(20).end
                  ],
                  [
                    new Cell(new Txt('FECHA DE SOLICITUD').end).alignment('center').fillColor('#dedede').end,
                    new Cell(new Txt(`${hoy}`).margin([0,6]).bold().end).end
                  ]
                ])).widths(['30%','70%']).end
                ).alignment('center').end,

              ]
            ]).widths(['45%','15%','40%']).layout('noBorders').end
            
          )


          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table(([
              [
                new Cell(new Txt('MATERIAL').margin([0,6]).bold().end).fillColor('#dedede').end,
                new Cell(new Txt('GRAMAJE    (g/m²)').bold().end).fillColor('#dedede').end,
                new Cell(new Txt('ANCHO DE BOBINA (cm)').bold().end).fillColor('#dedede').end,
                new Cell(new Txt('CORTE (cm)').margin([0,6]).bold().end).fillColor('#dedede').colSpan(2).end,
                new Cell(new Txt('').end).fillColor('#dedede').end,
                new Cell(new Txt('PESO (t)').margin([0,6]).bold().end).fillColor('#dedede').end,
                new Cell(new Txt('HOJAS (und)').margin([0,6]).bold().end).fillColor('#dedede').end,
                new Cell(new Txt('OBSERVACIÓN').margin([0,6]).bold().end).fillColor('#dedede').end,
              ],
              [
                new Cell(new Txt(data.sustrato).end).end,
                new Cell(new Txt(gramaje).end).end,
                new Cell(new Txt(ancho).end).end,
                new Cell(new Txt(ancho).end).end,
                new Cell(new Txt(largo).end).end,
                new Cell(new Txt(peso).end).end,
                new Cell(new Txt(hojas).color('red').end).end,
                new Cell(new Txt(observacion).end).end,
              ]
            ])).widths(['17%','11%','11%','11%','11%','11%','11%','17%']).alignment('center').end
          )

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table(([
              [
                new Cell(new Txt("").end).end,

                new Cell(new Table(([
                  [
                    new Cell(new Txt('SOLICITADO POR:').color('#ffffff').end).fillColor('#000000').alignment('center').end
                  ],
                  [
                    new Cell(new Stack(solicitado).end).alignment('center').end

                  ]
                ])).widths(['100%']).end
                ).end,
              ]

            ])).widths(['60%','40%']).layout('noBorders').alignment('center').end
          )




          pdf.create().download(`CONVERSION_${resp}`)

        }

        recibo();

      })
  }

  // getSustratos(){
  //   this.api.getSustratos()
  //     .subscribe((resp:any)=>{
  //       console.log(resp)
  //       if(resp.length>0){
  //         this.boolean_sustrato = true;
  //         this.Sustratos = resp;
  //       }
  //     })

  totalizar(neto,cantidad){
    let total = neto*cantidad;
    return total;
  }

  

  BuscarTotal(Material:any, cantidad_Mat:any, cantidad_orden:any){
    let El_Material = this.ALMACEN.find(x=> x.nombre == Material)
    const total_necesario = (cantidad_Mat / 1000) * cantidad_orden
    let Total_en_Presentacion = total_necesario / El_Material.neto

    if( Total_en_Presentacion % 1 == 0 ){

      if(Total_en_Presentacion < 1){
        Total_en_Presentacion = 1;
      }
    
      return {total:Total_en_Presentacion,
        presentacion: El_Material.presentacion}

    }else {
      Total_en_Presentacion = Math.round(Total_en_Presentacion)

      if(Total_en_Presentacion < 1){
        Total_en_Presentacion = 1;
      }
      
      return {total:Total_en_Presentacion,
              presentacion: El_Material.presentacion}
    }

  }

  

  RestarMaterial(material, total){
    const data = {
      material:material.material,
      total
    }


    let Descuento = this.DESCUENTOS.find(x => x.material == material.material)

    if(!Descuento){
      this.DESCUENTOS.push(data)
    }

  }

  modal_eliminacion(){
    if(this.eliminacion){
      this.eliminacion = false;
    }else{
      this.eliminacion = true;
    }
  }

  eliminar_p(nombre, cantidad, id, sustrato?){
    this.name_p_e = nombre
    this.cantidad_p_e = cantidad
    this.id_p_e = id

    if(sustrato){
      this.eliminar_sustrato = true;
    }

    this.modal_eliminacion();

  }

  confirmar_eliminacion(motivo){

    motivo = motivo.value;

    if(this.eliminar_sustrato){
      this.api.eliminarSustrato(this.id_p_e, motivo)
      .subscribe((resp:any)=>{
        this.BuscarAlmacen();
        this.porConfirmar();
        this.modal_eliminacion();
        
        this.BuscarAlmacen();
        this.BuscarGruposEnAlmacen();
        this.getbobinas();
        // this.getSustratos();
        this.porConfirmar();
        console.log(resp)
      })
    }else{
      this.api.eliminarMaterial(this.id_p_e, motivo)
        .subscribe((resp:any)=>{
          console.log(resp)
          this.BuscarAlmacen();
          this.porConfirmar();
          this.modal_eliminacion();
        })
    }

  }

  

  descargarInventario(desde, hasta){
    const data = {
      desde:desde.value,
      hasta:hasta.value
    }

    this.api.reporteInventario(data)
      .subscribe((resp:any)=>{


        console.log('aqui es la broma:', resp)

        const pdf = new PdfMakeWrapper();
        PdfMakeWrapper.setFonts(pdfFonts);

        async function generarPDF(){

          pdf.add(
            new Table([
              [
                new Cell( new Txt(` Movimientos Realizados en el Almacen`).end).alignment('center').end,
              ],
              [
                new Cell( new Txt(` Desde: ${desde.value} Hasta: ${hasta.value}`).end).alignment('center').end,
              ]
            ]).widths(['100%']).layout('noBorders').end
          )

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell( new Txt('PRODUCTOS EN ALMACEN').end).fillColor('#dedede').alignment('center').end,
              ]
            ]).widths(['100%']).layout('noBorders').end
          )

          pdf.add(

            pdf.ln(2)
            
          )
          pdf.add(
            new Table([
              [
                new Cell( new Txt(`NOMBRE`).end).end,
                new Cell( new Txt(`PRESENTACIÓN`).end).end,
                new Cell( new Txt(`CANTIDAD`).end).end,
                new Cell( new Txt(`CÓDIGO`).end).end,
                new Cell( new Txt(`LOTE`).end).end,
                
              ]
            ]).widths(['20%','20%','20%', '20%', '20%']).end
          )
          for(let i = 0; i < resp.almacen.length; i++){
            pdf.add(
              new Table([
                [
                  new Cell( new Txt(`${resp.almacen[i].nombre}`).end).end,
                  new Cell( new Txt(`${resp.almacen[i].presentacion} ${resp.almacen[i].neto} ${resp.almacen[i].unidad}`).end).end,
                  new Cell( new Txt(`${resp.almacen[i].cantidad}`).end).end,
                  new Cell( new Txt(`${resp.almacen[i].codigo}`).end).end,
                  new Cell( new Txt(`${resp.almacen[i].lote}`).end).end,
                  
                ]
              ]).widths(['20%','20%','20%', '20%', '20%']).end
            )
          }

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell( new Txt('PRODUCTOS INGRESADOS EN LA FECHA ESTIPULADA').end).fillColor('#dedede').alignment('center').end,
              ]
            ]).widths(['100%']).layout('noBorders').end
          )

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell( new Txt(`NOMBRE`).end).end,
                new Cell( new Txt(`PRESENTACIÓN`).end).end,
                new Cell( new Txt(`CANTIDAD`).end).end,
                new Cell( new Txt(`CÓDIGO`).end).end,
                new Cell( new Txt(`LOTE`).end).end,
                
              ]
            ]).widths(['20%','20%','20%', '20%', '20%']).end
          )
          for(let i = 0; i < resp.ingresos.length; i++){
            pdf.add(
              new Table([
                [
                  new Cell( new Txt(`${resp.ingresos[i].material.nombre}`).end).end,
                  new Cell( new Txt(`${resp.ingresos[i].material.presentacion} ${resp.ingresos[i].material.neto} ${resp.ingresos[i].material.unidad}`).end).end,
                  new Cell( new Txt(`${resp.ingresos[i].material.cantidad}`).end).end,
                  new Cell( new Txt(`${resp.ingresos[i].material.codigo}`).end).end,
                  new Cell( new Txt(`${resp.ingresos[i].material.lote}`).end).end,
                  
                ]
              ]).widths(['20%','20%','20%', '20%', '20%']).end
            )
          }

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell( new Txt('SALIDAS DEL ALMACEN').end).fillColor('#dedede').alignment('center').end,
              ]
            ]).widths(['100%']).layout('noBorders').end
          )

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell( new Txt(`NOMBRE`).end).end,
                new Cell( new Txt(`PRESENTACIÓN`).end).end,
                new Cell( new Txt(`CANTIDAD`).end).end,
                new Cell( new Txt(`RAZON`).end).end,
                new Cell( new Txt(`FECHA`).end).end,
                
              ]
            ]).widths(['20%','20%','20%', '20%', '20%']).end
          )
          for(let i = 0; i < resp.descuentos.length; i++){
            pdf.add(
              new Table([
                [
                  new Cell( new Txt(`${resp.descuentos[i].material.nombre}`).end).end,
                  new Cell( new Txt(`${resp.descuentos[i].material.presentacion} ${resp.descuentos[i].material.neto} ${resp.descuentos[i].material.unidad}`).end).end,
                  new Cell( new Txt(`${resp.descuentos[i].descuento}`).end).end,
                  new Cell( new Txt(`${resp.descuentos[i].razon}`).end).end,
                  new Cell( new Txt(`${resp.descuentos[i].fecha.slice(0, 10)}`).end).end,
                  
                ]
              ]).widths(['20%','20%','20%', '20%', '20%']).end
            )
          }




          
            
          pdf.create().download()
          
        }
        generarPDF();
        this.modal_reporte()
      })

  }

  totalizar_materiales(){

    for(let i=0; i<this.Almacenado.length; i++){
      let existe = this.TOTALES.find(x => x.material == this.Almacenado[i].material.nombre && x.marca == this.Almacenado[i].material.marca);
      if(existe){
          let x = this.TOTALES.findIndex(x => x.material == this.Almacenado[i].material.nombre && x.marca == this.Almacenado[i].material.marca)
          
          this.TOTALES[x].total = Number(this.TOTALES[x].total)
          this.Almacenado[i].cantidad = Number(this.Almacenado[i].cantidad)
          this.Almacenado[i].neto = Number(this.Almacenado[i].material.neto)

          let def = (this.Almacenado[i].neto * this.Almacenado[i].cantidad) / this.TOTALES[x].neto

          this.TOTALES[x].total = this.TOTALES[x].total + def;

        }else{
        this.TOTALES.push({
                       material:this.Almacenado[i].material.nombre,
                       marca:this.Almacenado[i].material.marca,
                       calibre:this.Almacenado[i].material.calibre,
                       gramaje:this.Almacenado[i].material.gramaje,
                       grupo:this.Almacenado[i].material.grupo.nombre,
                       presentacion:this.Almacenado[i].material.presentacion,
                       neto:this.Almacenado[i].material.neto,
                       unidad:this.Almacenado[i].material.unidad,
                      ancho:this.Almacenado[i].material.ancho,
                      largo:this.Almacenado[i].material.largo,
                      total:this.Almacenado[i].cantidad
                    })
      }
    }

  }

  changeView(){

    if(this.resumido){
      this.resumido = false;
      this.detallado = true;
    }else{
      this.resumido = true;
      this.detallado = false;
    }
  }

  seleccion_inventario(material, marca){
    
    let materiales_en_almacen = [];

    for(let i=0; i<this.ALMACEN.length; i++){
      if(this.ALMACEN[i].nombre == material && this.ALMACEN[i].marca == marca){
        materiales_en_almacen.push({
          nombre:this.ALMACEN[i].nombre,
          marca:this.ALMACEN[i].marca,

        });
      }
    }

    return materiales_en_almacen;
  }
  
  caja(cajas){
    this.caja_ = cajas;
  }

  finalizar_asignacion(){
        this.BuscarAlmacen()
        this.porConfirmar()
        this.getAalmacenado()
        this.getOrdenes()
  }

  // existencia(x){
  //   let lotes = this.LOTES.length;
  //   let existencia = 0;
  //   for(let i = 0; i<lotes; i++){
  //     if(this.LOTES[i].i == x){
  //       existencia = existencia + this.LOTES[i].almacenado;
  //     } 
  //   }

  //   return existencia
  // }




}
