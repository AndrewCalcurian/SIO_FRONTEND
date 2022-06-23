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

  public cintas_:any
  public LOTES = [];
  public Requisiciones = [];

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
    console.clear();
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

  Caja_(caja:number, cinta:number){
    caja = Math.ceil(caja);
    this.cintas_= Number(cinta * caja)
    return caja
  }

  Lote(e, material, i, hojas, grupo, cantidad,m_cantidad,unidad,cinta?){

    console.log({
      e:e,
      material,
      i,
      hojas,
      grupo,
      cantidad,
      m_cantidad,
      unidad,
      cinta
    })

    let splited = e.split('-')
    e = splited[1]
    let codigo = splited[0]

    let EnAlmacen = this.Almacenado.find(x => x.material.nombre === material && x.lote === e && x.codigo === codigo)
    let _cantidad

    if(grupo === 'Tinta'){
      _cantidad = (m_cantidad * hojas) / 1000;
    }else if(grupo === 'Barniz'){
      _cantidad = (m_cantidad * hojas) / 1000;
    }else if(grupo === 'Pega'){
      _cantidad = (m_cantidad * cantidad) / 1000;
    }else if(grupo === 'Cajas Corrugadas'){
      _cantidad = cantidad / m_cantidad;
      cinta  = cinta * _cantidad;
    }else if(grupo === 'Cinta de Embalaje'){
      _cantidad = this.cintas_;
    }

    let unidad_necesaria = _cantidad / EnAlmacen.material.neto;


    unidad_necesaria = Math.ceil(unidad_necesaria)
    EnAlmacen.cantidad = Math.trunc(EnAlmacen.cantidad)

    let previo = this.LOTES.filter(x => x.i === i)

    if(EnAlmacen.material.grupo.nombre === 'Sustrato'){
      unidad_necesaria = hojas
    }

    if(previo.length > 0){

      if(previo[previo.length-1].restante){
        unidad_necesaria = previo[previo.length-1].restante
      }

    }


    document.getElementById(`Necesario-${i}`).innerHTML = `${unidad_necesaria} ${EnAlmacen.material.presentacion}(s) necesaria(s)`
    document.getElementById(`Almacenados-${i}`).innerHTML = `${EnAlmacen.cantidad} ${EnAlmacen.material.presentacion}(s) En Almacen`
    
    
    let restante =  EnAlmacen.cantidad - unidad_necesaria;
    restante = Math.trunc(restante)

    let cantidad_solicitada;

    if(restante < 0){
      restante = Math.abs(restante);
      document.getElementById(`Restante-${i}`).innerHTML = `
      <b>Faltan: </b>${restante} <br>
      `
      document.getElementById(`fijar_lote-${i}`).style.display = "block";

      let check = document.getElementById(`fijar_lote-${i}`);

      cantidad_solicitada = EnAlmacen.cantidad;
      check.onclick = () => this.fijalote(e,codigo, 0, i, (EnAlmacen.cantidad*EnAlmacen.material.neto), restante,cantidad_solicitada, unidad)

    }else{
      document.getElementById(`fijar_lote-${i}`).style.display = "none";
      document.getElementById(`Restante-${i}`).innerHTML = `<b>Restan: </b>${restante} ${EnAlmacen.material.presentacion}(s) En Almacen`
      
      cantidad_solicitada = EnAlmacen.cantidad - restante;
      let existe = this.LOTES.find(x => x.lote === e)

      if(!existe){
        this.LOTES.push({lote:e,codigo:codigo,resta:restante,i,almacenado:EnAlmacen.cantidad,solicitado:cantidad_solicitada,unidad})
      }
      else{
        this.LOTES.push({lote:e,codigo,resta:restante,i,almacenado:EnAlmacen.cantidad,solicitado:cantidad_solicitada,unidad})
      }
      
      console.log(this.LOTES)
    }



  }

  fijalote(lote,codigo, resto, i, almacenado, restante,solicitado,unidad){

    let existe = this.LOTES.find(x => x.lote == lote)

      if(!existe){
        this.LOTES.push({lote,codigo,resta:resto,i,almacenado,restante:restante,solicitado,unidad})
        console.log(this.LOTES)
      }else{
        let index = this.LOTES.findIndex(x => x.lote == lote)
        this.LOTES.push({lote,codigo,resta:resto,i,almacenado,restante:restante,solicitado,unidad})
      }

      console.log(this.LOTES)
  
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

  Restar(orden, solicitud){

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

    let En_Almacen = this.necesario[0].producto.materiales;
    let Cargados = this.LOTES.length

    
    for(let i = 0; i<En_Almacen.length; i++){
      let existe = this.LOTES.find(x => x.i === i);

      if(!existe){
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

    let data = {
      lotes:this.LOTES,
      orden,
      solicitud
    }
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
