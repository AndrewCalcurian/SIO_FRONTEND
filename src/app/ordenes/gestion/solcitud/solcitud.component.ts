import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solcitud',
  templateUrl: './solcitud.component.html',
  styleUrls: ['./solcitud.component.css']
})
export class SolcitudComponent implements OnInit {
  
  public materiales:any;
  public orden_selected;
  public Otro:boolean = false;
  public grupos;
  public almacenado
  public por_confirmar = []
  public _materiales = []
  public usuario
  public asociacion = '#'



  @Input() solicitud:any
  @Input() orden:any
  @Output() onCloseModal = new EventEmitter();

  constructor(private api:RestApiService) {

    this.usuario = api.usuario
   }

  ngOnInit(): void {
  }

  getGRupos(){
    this.api.GetGrupoMp()
      .subscribe((resp:any)=>{
        this.grupos = resp;
        // console.log(this.grupos)
      })
  }

  quitarMaterial(i){
    this.por_confirmar.splice(i)
    this._materiales.splice(i)
  }

  cambiarCantidades(i,e){
    this._materiales[i].cantidad = e;
    // console.log(this._materiales)
  }

  AdjuntarMaterial(e){
    let almacen = this.almacenado.find(x => x.material._id === e)
    this.por_confirmar.push(almacen)
    let mat = this._materiales.push({
      producto:almacen.material._id,
      cantidad:0
    })
    // console.log(this._materiales)
  }

  mostrarMaterial(e){
    if(e === "#"){
    (<HTMLInputElement>document.getElementById('_material_')).disabled = true
    }else{
      this.api.getAlmacenado()
        .subscribe((resp:any)=>{
          (<HTMLInputElement>document.getElementById('_material_')).disabled = false
          this.almacenado = resp.filter(x => x.material.grupo._id === e)
          let bs_= this.almacenado;
          if(e != '61f92a1f2126d717f004cca6'){
            this.almacenado = [...this.almacenado.reduce((map, obj) => map.set(obj.material.nombre, obj), new Map()).values()];
            for(let i=0;i<bs_.length;i++){
              let index = this.almacenado.find(x=> x.material.nombre === bs_[i].material.nombre && x.material.marca === bs_[i].material.marca)
              if(!index){
                this.almacenado.push(bs_[i])
              }
            }
            this.almacenado.sort(function(a, b) {
              if(a.material.nombre.toLowerCase() < b.material.nombre.toLowerCase()) return -1
              if(a.material.nombre.toLowerCase() > b.material.nombre.toLowerCase()) return 1
              return 0
    
            })
          }
        })
    }
  }

  TraerMateriales(e){

    // console.log(e)

    if(e === 'Otro'){
      this.Otro = true;
      this.getGRupos();
    }else{
      let Orden_seleccionada = this.orden.find(x => x.sort == e)
      this.orden_selected = Orden_seleccionada
      this.Otro = false;
      if(Orden_seleccionada){
        this.materiales = Orden_seleccionada.producto.materiales[Orden_seleccionada.montaje]
        console.log(this.materiales,'este')
        this.materiales.sort(function(a, b) {
          if(a.material.nombre.toLowerCase() < b.material.nombre.toLowerCase()) return -1
          if(a.material.nombre.toLowerCase() > b.material.nombre.toLowerCase()) return 1
          return 0

        })
      }else{
        this.materiales = undefined;
      }
    }
  }

  onClose(){
    this.solicitud = false;
    this.onCloseModal.emit();
  }

  FinalizarSolicitu(){
    let requisicion = {
      sort:this.asociacion,
      motivo:(<HTMLInputElement>document.getElementById('_motivo')).value,
      usuario:`${this.api.usuario.Nombre} ${this.api.usuario.Apellido}`,
      producto:{
        producto:'N/A',
        materiales:[[]]
      }
    }

    requisicion.producto.materiales[0] = this._materiales

    let aprobado = true

    for(let i=0;i<this._materiales.length;i++){
      this.api.getAlmacenadoID2(this._materiales[i].producto)
        .subscribe((resp:any)=>{
          let cantidad = 0;
          for(let i=0;i<resp.length;i++){
            cantidad = cantidad + Number(resp[i].cantidad)
          }

          if(cantidad < Number(this._materiales[i].cantidad)){
            Swal.fire({
              title:'Cantidad excedida',
              text:`la cantidad solicitada de ${resp[0].material.nombre} es mayor a la cantidad de producto en el almacen,
              existe en almacen: ${cantidad.toFixed(2)}`,
              icon:'warning',
              showConfirmButton:false
            })
            i = 1000
          }else if(i === this._materiales.length -1){
            this.api.postReq(requisicion)
               .subscribe((resp:any)=>{
                Swal.fire(
                {
                  showConfirmButton:false,
                   title:'Hecho!',
                  text:'Se realizó la solicitud correctamente',
                  icon:'success',
                  timer:5000
                }
              )
              this._materiales = []
              this.por_confirmar = []
              this.onClose()
            })
          }
        })

        // if(i === this._materiales.length -1){
        //   if(aprobado){
        //     this.api.postReq(requisicion)
        //        .subscribe((resp:any)=>{
        //         Swal.fire(
        //         {
        //           showConfirmButton:false,
        //            title:'Hecho!',
        //           text:'Se realizó la solicitud correctamente',
        //           icon:'success',
        //           timer:5000
        //         }
        //       )
        //       this._materiales = []
        //       this.onClose()
        //     })
        //   }
        // }
    }




  }

  FinalizarSolicitud(){

    let iteration = 0

    let requisicion = {
      sort:this.orden_selected.sort,
      motivo:(<HTMLInputElement>document.getElementById('razon')).value,
      usuario:`${this.api.usuario.Nombre} ${this.api.usuario.Apellido}`,
      producto:{
        producto:this.orden_selected.producto.producto,
        materiales:[[]]
      }
    }


  for(let i=0;i<this.materiales.length;i++){
    let _i = i.toString();

    let cantidad = (<HTMLInputElement>document.getElementById(_i)).value;
    let producto = (<HTMLInputElement>document.getElementById(_i)).name;

    let num = Number(cantidad)

    if(num > 0){

      iteration++
      requisicion.producto.materiales[0].push({
        cantidad,
        producto 
      })
    }


    // console.log(requisicion)


  }

  let cantidad = (<HTMLInputElement>document.getElementById('100')).value;
  let producto = (<HTMLInputElement>document.getElementById('100')).name;

  let num = Number(cantidad)

    if(num > 0){

      iteration++
      requisicion.producto.materiales[0].push({
        cantidad,
        producto 
      })
    }

  if(iteration>0){

    let materiales_fr =  requisicion.producto.materiales[0];

    //test
    for(let i=0;i<materiales_fr.length;i++){
      console.log(materiales_fr[i],'aqui')
      this.api.getAlmacenadoID2(materiales_fr[i].producto)
        .subscribe((resp:any)=>{
          let cantidad = 0;
          console.log(resp,'HABLAME DE TIII')
          for(let i=0;i<resp.length;i++){
            cantidad = cantidad + Number(resp[i].cantidad)
          }

          if(cantidad < Number(materiales_fr[i].cantidad)){
            Swal.fire({
              title:'Cantidad excedida',
              text:`la cantidad solicitada de ${resp[0].material.nombre} es mayor a la cantidad de producto en el almacen,
              existe en almacen: ${cantidad.toFixed(2)}`,
              icon:'warning',
              showConfirmButton:false
            })
            i = 1000
          }else if(i === materiales_fr.length -1){
            this.api.postReq(requisicion)
               .subscribe((resp:any)=>{
                Swal.fire(
                {
                  showConfirmButton:false,
                   title:'Hecho!',
                  text:'Se realizó la solicitud correctamente',
                  icon:'success',
                  timer:5000
                }
              )
              materiales_fr = []
              this.por_confirmar = []
              this.onClose()
            })
          }
        })

        // if(i === this._materiales.length -1){
        //   if(aprobado){
        //     this.api.postReq(requisicion)
        //        .subscribe((resp:any)=>{
        //         Swal.fire(
        //         {
        //           showConfirmButton:false,
        //            title:'Hecho!',
        //           text:'Se realizó la solicitud correctamente',
        //           icon:'success',
        //           timer:5000
        //         }
        //       )
        //       this._materiales = []
        //       this.onClose()
        //     })
        //   }
        // }
    }

    //test
    
  }else{
    Swal.fire(
      {
        showConfirmButton:false,
        title:'Error!',
        text:'Debe ingresar al menos una cantidad de cualquier producto',
        icon:'error'
      }
    )

    return
  }

  
  
  
}


}
