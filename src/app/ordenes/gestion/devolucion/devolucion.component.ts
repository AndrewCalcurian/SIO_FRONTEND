import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { from } from 'rxjs';
import { UnicosPipe } from 'src/app/pipe/unicos.pipe';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

import { PdfMakeWrapper, Txt, Img, Table, Cell, Columns, Stack } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as moment from 'moment';

@Component({
  selector: 'app-devolucion',
  templateUrl: './devolucion.component.html',
  styleUrls: ['./devolucion.component.css']
})
export class DevolucionComponent implements OnInit {

  @Input() devolucion:any
  @Output() onCloseModal = new EventEmitter();

  public devoluciones
  public materiales
  public repeticion = [];
  public Data_devolucion = [];
  public usuario;
  public RepuestoAprobados = []
  public Repuesto = false;

  constructor(private api:RestApiService) {
    this.usuario = api.usuario
  }

  ngOnInit(): void {
    this.api.getLotes()
    .subscribe((resp:any)=>{
      this.devoluciones = resp;
      for(let i = 0; i< resp.length; i++){
        this.repeticion.push(resp[i].orden)
        let final = resp.length - 1
        if(i == final){
          const dataArr = new Set(this.repeticion);
          let result = [...dataArr];
          this.repeticion = result.reverse();
        }
      }
      
    })
  }


  getRepuestosAceptados(asignacion){
    this.api.getRepuestosFinalizados(asignacion) 
      .subscribe((resp:any)=>{
        this.RepuestoAprobados = resp;
        // console.log(this.RepuestoAprobados)
      })
  }
  
  seleccionarMateriales(){
    let orden_ = (<HTMLInputElement>document.getElementById('ordens')).value
    if(orden_ === 'Repuesto'){
      this.Repuesto = true;
    }else{
      this.Repuesto = false;
    }
    this.materiales = this.devoluciones.filter(devoluciones => devoluciones.orden === orden_);
    // console.log(this.materiales)
    for(let i=0;i<this.materiales.length;i++){
      if(!this.materiales.nombre){
        // console.log(this.materiales[i])
        this.materiales.slice(i,1);
      }else{
        this.materiales[i].material.sort(function(a, b) {
          if(a.material.nombre.toLowerCase() < b.material.nombre.toLowerCase()) return -1
          if(a.material.nombre.toLowerCase() > b.material.nombre.toLowerCase()) return 1
          return 0
  
        })
      }
    }
    let malas = this.materiales.filter(materiales => materiales.material[0].material === null)
    if(orden_ == '#'){
    this.materiales = this.materiales.filter(materiales => materiales.material[0].material != null);
    }

    // console.log(this.materiales)
    this.materiales = this.materiales.reverse();
  // this.materiales = this.materiales.material
  
  }

  onClose(){
    this.devolucion = false;
    this.onCloseModal.emit();
  }

  finalizarDevolucion(id,motivo){

    if(motivo.value.length < 1){
      let id_ = String(id)
      document.getElementById(id_).focus();
      document.getElementById(`${id_}_error`).style.display = "block";
      return
    }

    let filtrado = this.Data_devolucion.filter(x => x.id === id && x.cantidad > 0)
    let orden = (<HTMLInputElement>document.getElementById('ordens')).value
    let data = {
      orden,
      filtrado,
      motivo:motivo.value,
      id,
      usuario:`${this.usuario.Nombre} ${this.usuario.Apellido}`
    }


    let lote = this.devoluciones.find(x=> x._id == data.id)

    
    
    
    for(let iter=0;iter<data.filtrado.length;iter++){
      
      let material = data.filtrado[iter].material
      let _lote = data.filtrado[iter].lote
      let _codigo = data.filtrado[iter].codigo


      let comparativa = lote.material.findIndex(x=> x.material._id == material && x.lote == _lote && x.codigo == _codigo);
      
    
      // console.log(data.filtrado[iter].cantidad,'>',lote.material[comparativa].cantidad)

      if(data.filtrado[iter].cantidad > Number(lote.material[comparativa].cantidad)){
        console.log(data.filtrado[iter],'___', data.filtrado[iter].cantidad)
        console.log(lote.material[comparativa],'___', lote.material[comparativa].cantidad)
        Swal.fire({
          title:'Error',
          text:'La cantidad de material devuelto no puede ser mayor a la asignada',
          icon:'error',
          showConfirmButton:false
        })

        return
      }
    }

    this.api.postDevolucion(data)
      .subscribe((resp:any)=>{
       Swal.fire({
        title:'Devolución',
        text: 'Se realizó la devolución de materiales',
        icon:'success',
        timer:3000,
        showConfirmButton:false
    }),
    (<HTMLInputElement>document.getElementById('ordens')).value = "·"
    this.onClose();
    })

  }

  formate(n){
    if(n >= 10){
      n = `00${n}`
  }
  else if(n >= 100){
    n = `0${n}`
  }
  else if(n < 10){
    n = `000${n}`
  }
    // console.log(n)
    return `AL-ASG-${n}`
  }

  agregarMaterial(id, cantidad, material,lote,codigo){
    
    let data = 
    {
      id,
      material,
      lote,
      codigo,
      cantidad:cantidad.value
    }

    let index = this.Data_devolucion.findIndex(x => x.id === id && x.material === material && x.lote === lote && x.codigo === codigo)

    if(index == -1 ){
      this.Data_devolucion.push(data);
    }else{
      this.Data_devolucion[index] = data
    }

    // console.log(data)

    // // console.log(this.Data_devolucion)

  }

  buscarAsignacion(e){
    let asignacion = '24';
    asignacion = asignacion + e;
    this.getRepuestosAceptados(asignacion)
  }

  CerrarDevolucion(id){
    this.api.putCerrarLotes({id:id})
      .subscribe((resp:any)=>{
        this.api.getLotes()
    .subscribe((resp:any)=>{
      this.devoluciones = resp;
      for(let i = 0; i< resp.length; i++){
        this.repeticion.push(resp[i].orden)
        let final = resp.length - 1
        if(i == final){
          const dataArr = new Set(this.repeticion);
          let result = [...dataArr];
          this.repeticion = result;
        }
      }
      this.seleccionarMateriales();
      Swal.fire({
        icon:'info',
        title:'Eliminado',
        text:'Ya no se mostrará en un futuro',
        timer:4000,
        timerProgressBar: true,
        showConfirmButton:false
      })
    })
      })
  }


  DescargarFormato(materiales){
    const pdf = new PdfMakeWrapper();
    PdfMakeWrapper.setFonts(pdfFonts);

    console.log(materiales)

    async function generarPDF(){
      for(let i=0;i<materiales.length;i++){
        let material:any = materiales[i]
        pdf.add(
          new Table([
            [
              new Cell(new Txt(`AL-ASG-${material.asignacion}`).fontSize(6).end).border([false,false]).color('#ffffff').fillColor('#909090').end
            ]
          ]).widths(['100%']).end
        )
        // pdf.add(
        //   new Table([
        //     [
        //       new Cell(new Txt(`Material`).bold().fontSize(6).end).end,
        //       new Cell(new Txt(`Lote`).bold().fontSize(6).end).end,
        //       new Cell(new Txt(`Devuelto`).bold().fontSize(6).end).end
        //     ]
        //   ]).widths(['70%','20%','10%']).end
        // )
        for(let x=0;x<material.material.length;x++){
          let color = '#e0e0e0'
          if(x % 2 === 0){
            color = '#ffffff';
          }
          pdf.add(
            new Table([
              [
                new Cell(new Txt(`${material.material[x].material.nombre} (${material.material[x].material.marca}) #${material.material[x].codigo}`).fontSize(6).end).border([false, false]).fillColor(color).end,
                new Cell(new Txt(`${material.material[x].lote}`).fontSize(6).end).border([false, false]).fillColor(color).end,
                new Cell(new Txt(``).fontSize(6).end).border([false, false]).fillColor(color).end
              ]
            ]).widths(['70%','20%','10%']).end
          )
        }
      }
      pdf.create().download(`test`)
    }
    generarPDF();
  }

}
