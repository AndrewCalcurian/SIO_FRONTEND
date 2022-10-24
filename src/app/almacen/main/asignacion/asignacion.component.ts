import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {

  @Input() necesario:any
  @Input() asignacion:any
  @Input() ALMACEN:any
  @Input() Almacenado:any
  @Output() onCloseModal = new EventEmitter();
  @Output() onFinalizarAsignacion = new EventEmitter();
  @Output() onAgregarRequisicioes = new EventEmitter();

  public cintas_:any = []
  public LOTES = [];
  public Requisiciones = [];
  public cinta:any;

  constructor(private api:RestApiService) { }

  ngOnInit(): void {
    this.buscarRequisicion()
  }

  onClose(){
    this.LOTES = [];
    this.asignacion = false;
    this.onCloseModal.emit();
  }

  buscarRequisicion(){
    this.api.getRequi()
    .subscribe((resp:any)=>{
      for(let i =0; i<resp.length;i++){
        this.necesario.push(resp[i])
      }
      // this.onAgregarRequisicioes.emit(resp)
    })
  }

  Unidad(material){
    let unidad = this.ALMACEN.find(x => x.nombre === material)

    return unidad.unidad
  }

  Caja_(caja:number, cinta:number, index){
    caja = Math.ceil(caja);
    this.cintas_.push({
      cantidad:Number(cinta * caja),
      index
    })
    // this.cintas_= Number(cinta * caja)
    // // console.log(this.cintas_.length)
    return caja
  }

  _cinta_(){

  }

  Descuentos(material){
    let descuento = 0;
    let descuentos = this.LOTES.filter(x => x.material === material)

    if(descuentos.length > 0){
      // alert('si')
      for(let i=0; i<descuentos.length; i++){
        if(descuentos[i].cantidad){
          descuento = descuento + Number(descuentos[i].almacenado)
        }
        descuentos[i].necesaria
        
        if(i == descuentos.length-1){
          return descuento
        }
      }
    }else{
      return 0
    }

  }

  cinta_lad(n, i){
    this.cintas_.push({
      cantidad:Number(n),
      index:i
    })

    return this.cintas_[i].cantidad
  }

  Lote(e,index, orden, material, i, hojas, grupo, cantidad,m_cantidad,unidad,cinta?){

    // alert(index)

    // // console.log({
    //   e:e,
    //   material,
    //   i,
    //   hojas,
    //   grupo,
    //   cantidad,
    //   m_cantidad,
    //   unidad,
    //   cinta
    // })


    // let BuscarDescuento = new Promise((resolve, reject)=>{
    //   let descuento = 0;
    //   let descuentos = this.LOTES.filter(x => x.material === material)

    //   if(descuentos.length > 0){
    //     for(let i=0; i<descuentos.length; i++){
    //       if(descuentos[i].necesaria){
    //         descuento = descuento + Number(descuentos[i].cantidad)
    //         // console.log('descuento', descuento)
    //       }
    //       descuentos[i].necesaria

    //       if(i == descuentos.length-1){
    //         resolve(descuento)
    //       }
    //     }
    //   }else{
    //     resolve(descuento)
    //   }

    // })

    // BuscarDescuento
    //   .then(function(descuento){
    //     // console.log(descuento,'*/*')

    //   })



    let splited = e.split('*')
    e = splited[1]
    let codigo = splited[0]

    let EnAlmacen = this.Almacenado.find(x => x.material.nombre === material && x.lote === e && x.codigo === codigo)
    let _cantidad

    // alert(grupo)

    if(grupo === 'Tinta'){
      _cantidad = (m_cantidad * hojas) / 1000;
      // // console.log(m_cantidad,'m_cantidad')
    }else if(grupo === 'Barniz'){
      _cantidad = (m_cantidad * hojas) / 1000;
    }else if(grupo === 'Pega'){
      _cantidad = (m_cantidad * cantidad) / 1000;
    }else if(grupo === 'Cajas Corrugadas'){
      _cantidad = cantidad / m_cantidad;
      // // console.log(cantidad,'/////',m_cantidad,'/',grupo,'0',_cantidad)
      // cinta  = cinta * _cantidad;
    }else if(grupo === 'CINTA DE EMBALAJE' || grupo === 'Cinta de Embalaje'){
      if(!this.cintas_[index]){
        _cantidad = m_cantidad * 100 ;
      }else{
        _cantidad = this.cintas_[cinta].cantidad;
      }
    }else if(grupo === 'Sustrato'){
      _cantidad = 5;
    }

    _cantidad = _cantidad

    // alert(m_cantidad)


    let unidad_necesaria = _cantidad / (EnAlmacen.material.neto + this.Descuentos(material));

    // // console.log(_cantidad,'-',EnAlmacen.material.neto)

    // // console.log( unidad_necesaria )


    unidad_necesaria = Math.ceil(unidad_necesaria)
    EnAlmacen.cantidad = Math.trunc(EnAlmacen.cantidad)


    let previo = this.LOTES.filter(x => x.i === i)

    if(EnAlmacen.material.grupo.nombre === 'Sustrato' && orden.cliente){
      unidad_necesaria = hojas - this.Descuentos(material)
      // alert(this.Descuentos(material))
    }
    else if(EnAlmacen.material.grupo.nombre === 'Sustrato' && !orden.cliente){
        unidad_necesaria = m_cantidad - this.Descuentos(material);
        // // console.log('aqui')
    }

    // if(previo.length > 0){

    //   if(previo[previo.length-1].restante){
    //     unidad_necesaria = previo[previo.length-1].restante
    //   }

    // }


    if(EnAlmacen.material.presentacion === 'PALETA' || EnAlmacen.material.presentacion === 'Paleta'){
      EnAlmacen.material.presentacion = 'HOJA'
    }
    document.getElementById(`Necesario-${index}-${i}`).innerHTML = `${unidad_necesaria} ${EnAlmacen.material.presentacion}(s) necesaria(s)`
    document.getElementById(`Almacenados-${index}-${i}`).innerHTML = `${EnAlmacen.cantidad} ${EnAlmacen.material.presentacion}(s) En Almacen`


    let restante =  EnAlmacen.cantidad - unidad_necesaria;
    restante = Math.trunc(restante)

    let cantidad_solicitada;

    if(restante < 0){
      restante = Math.abs(restante);
      document.getElementById(`Restante-${index}-${i}`).innerHTML = `
      <b>Faltan: </b>${restante} <br>
      `
      document.getElementById(`fijar_lote-${index}-${i}`).style.display = "block";

      let check = document.getElementById(`fijar_lote-${index}-${i}`);

      cantidad_solicitada = EnAlmacen.cantidad;
      check.onclick = () => this.fijalote(e,codigo, 0, i, (EnAlmacen.cantidad*EnAlmacen.material.neto), restante,cantidad_solicitada, unidad, _cantidad, material)

    }else{
      document.getElementById(`fijar_lote-${index}-${i}`).style.display = "none";
      document.getElementById(`Restante-${index}-${i}`).innerHTML = `<b>Restan: </b>${restante} ${EnAlmacen.material.presentacion}(s) En Almacen`

      cantidad_solicitada = EnAlmacen.cantidad - restante;
      let existe = this.LOTES.find(x => x.lote === e)

      if(!existe){
        this.LOTES.push({lote:e,codigo:codigo,resta:restante,i,almacenado:EnAlmacen.cantidad,solicitado:cantidad_solicitada,unidad})
      }
      else{
        this.LOTES.push({lote:e,codigo,resta:restante,i,almacenado:EnAlmacen.cantidad,solicitado:cantidad_solicitada,unidad})
      }

      // // console.log(this.LOTES)
    }



  }

  fijalote(lote,codigo, resto, i, almacenado, restante,solicitado,unidad,cantidad?,material?){

    let existe = this.LOTES.find(x => x.lote == lote)

      if(!existe){
        this.LOTES.push({lote,codigo,resta:resto,i,almacenado,restante:restante,solicitado,unidad,cantidad,material})
        // // console.log(this.LOTES)
      }
     else{
      this.LOTES.push({lote,codigo,resta:resto,i,almacenado,restante:restante,solicitado,unidad,cantidad,material})
      //   let index = this.LOTES.findIndex(x => x.lote == lote)
      //   this.LOTES.push({lote,codigo,resta:resto,i,almacenado,restante:restante,solicitado,unidad,cantidad,material})
      }

      // // console.log(this.LOTES)

  }

  cantidad_lotes(x){

    let lotes = this.LOTES.length;
    let total = 0;

    for(let i = 0; i<lotes; i++){
      if(this.LOTES[i].i == x){
        total ++
      }
    }

    return total;

  }

  borrarLote(lote){
    let index = this.LOTES.findIndex(x => x.lote === lote)

    this.LOTES.splice(index,1)
  }

  Restar(orden, solicitud,index,n,requi?){

    let largo = solicitud.length;

    if(solicitud == 1){
      solicitud = `000${solicitud}`;
    }
    if(solicitud == 2){
      solicitud = `00${solicitud}`;
    }
    if(solicitud == 3){
      solicitud = `0${solicitud}`;
    }

    let En_Almacen = this.necesario[index].producto.materiales[this.necesario[index].montaje];
    // // console.log(En_Almacen,'almacen')
    let Cargados = this.LOTES.length


    for(let i = 0; i<En_Almacen.length; i++){
      let existe = this.LOTES.find(x => x.i === i);
      // // console.log(En_Almacen.length,'/-',i)
      if(!existe){
        // // console.log(this.LOTES)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Debes cubrir toda la materia prima para esta orden',
          showConfirmButton: false,
          timer:1500
        })
        return
      }else{
        // // console.log(En_Almacen[0][i],'i')
        if(En_Almacen[i].producto.grupo.nombre === 'Cajas Corrugadas'){
          let _existe = this.LOTES.find(x => x.i === 100);
          if(!_existe){
            // // console.log(this.LOTES)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Debes cubrir toda la materia prima para esta orden',
              showConfirmButton: false,
              timer:1500
            })
            return
          }
        }
      }

    }

    let data = {
      lotes:this.LOTES,
      orden,
      solicitud,
      n,
      requi
    }

    // // console.log('data lotes',data.lotes)

    this.api.realizarDescuentoAlmacen(data)
      .subscribe(resp=> {
        Swal.fire({
          icon: 'success',
          title: 'Excelente!',
          text: 'La nueva orden ya esta generada',
          showConfirmButton: false,
          timer:1500
        })
        this.onCloseModal.emit();
        this.onFinalizarAsignacion.emit();
      })

  }



}
