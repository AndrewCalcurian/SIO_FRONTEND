import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { RestApiService } from 'src/app/services/rest-api.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {
  
  public TRABAJOS = [];
  public MAQUINAS;
  public NUEVA_GESTION:boolean = false;
  public FASE = 'IMPRESION';
  public GESTIONES;
  public LAST_ONE;
  public HOY = moment().format('yyyy-MM-DD');
  public FASES = [];
  public FUNCIONES = [];

  public GRUPOS = [];

  constructor(private api:RestApiService) { }

  ngOnInit(): void {
    this.Tarea();
    this.getMaquinas();
    this.getGestiones();
    this.api.getGrupos()
      .subscribe((resp:any)=>{

        this.GRUPOS = resp.grupos
        console.log(this.GRUPOS,'___________________________________________*')
      })
  }

  modal_nueva_gestion(){
    if(!this.NUEVA_GESTION){
      this.NUEVA_GESTION = true
    }else{
      this.NUEVA_GESTION = false
    }
  }
  fase(e){
    this.FASE = e.target.value;
    this.TRABAJOS = [];
    this.Tarea();
  }

  getMaquinas(){
    this.api.GetMaquinas()
      .subscribe(resp =>{
        this.MAQUINAS = resp
        this.obtenerTipos();
      })
  }

  obtenerTipos(){
    let x = this.MAQUINAS.length;
    for(let i = 0; i< x; i++){
      let inde = this.FUNCIONES.includes(this.MAQUINAS[i].tipo)
      if(!inde){
        this.FUNCIONES.push(this.MAQUINAS[i].tipo)
      }
    }
  }

  calcular_Productos(e){
    let value_hojas = e.target.value;
    let orden =  (<HTMLInputElement>document.getElementById('orden_selected')).value;

    let separator = orden.split('-')
    orden = separator[1];

    let Ejemplares = this.TRABAJOS.find(x => x._id == orden);


    const productos:any = value_hojas * Ejemplares.orden.producto.ejemplares[Ejemplares.orden.montaje];

    console.log(value_hojas,'value');
    console.log(Ejemplares,'Ejemplares');

    (<HTMLInputElement>document.getElementById('productos_input')).value = productos;
  }

  calcular_Hojas(e){
    let value_productos = e.target.value;

    let orden =  (<HTMLInputElement>document.getElementById('orden_selected')).value;

    let separator = orden.split('-')
    orden = separator[1];


    let Ejemplares = this.TRABAJOS.find(x => x._id == orden);

    const productos:any = value_productos / Ejemplares.orden.producto.ejemplares;

    (<HTMLInputElement>document.getElementById('hojas_input')).value = productos;
  }

  retrasar(orden:any, maquina:any, fecha:any, trabajo:any){

    let data = {
      orden:orden,
      maquina:maquina,
      fecha:fecha,
      trabajo:trabajo,
    }

    this.api.postRestrasar(data)
      .subscribe((resp:any)=>{
        console.log(resp)
        Swal.fire({
          icon:'info',
          title:'Se realizó un retraso en la planificación',
          text:'se agregó 1 dia mas a esta gestión y a todas las ordenes que utilicen estos mismos equipos',
        });
        this.TRABAJOS = [];
        this.Tarea();
        this.getMaquinas();
        this.getGestiones();
      });
  }

  acelerar(orden:any, maquina:any, fecha:any, trabajo:any, fechaI:any){

    let fecha_lapsos = moment(fecha)
    let fechaI_lapso = moment(fechaI)
    let lapso = fecha_lapsos.diff(fechaI_lapso, 'days')

    if(lapso < 1){
      Swal.fire({
        icon:'error',
        text:'Esta gestión termina hoy',
      });
      return
    }

    let data = {
      orden:orden,
      maquina:maquina,
      fecha:fecha,
      trabajo:trabajo,
    }

    this.api.postAcelerar(data)
      .subscribe((resp:any)=>{
        Swal.fire({
          icon:'success',
          title:'Fue adelantada la planificación',
          text:'se adelantó 1 dia mas a esta gestión y a todas las ordenes que utilizen estos mismos equipos',
        });
        this.TRABAJOS = [];
        this.Tarea();
    this.getMaquinas();
    this.getGestiones();
      })
  }

  CompararTama(op, fase, grupo, hojas_, productos_,){
    // console.log(fase,'<>',grupo)
    let group = this.GRUPOS.find(x=> x._id === grupo)

    let index = group.tipos.findIndex(x => x === fase)

    if(index > 0){
      let gest = this.GESTIONES.filter(x => x.maquina.tipo == group.tipos[index -1] && x.op == op)
      let hojas = 0;
      let productos = 0;
      for(let i =0; i<gest.length; i++){
        hojas = hojas + Number(gest[i].hojas);
        productos = productos + Number(gest[i].productos);
      }

      console.log(hojas,'<->',productos)
      if(hojas < hojas_ || productos < productos_){
        Swal.fire({
          title:'Error!',
          text:'La cantidad excede las gestiones realizadas en la fase anterior',
          icon:'error',
          showConfirmButton:false
        })
        return 1
      }
    }
  }

  finalizar(){

    let hoy = moment().format('yyyy-MM-DD');
    let orden =  ''
    let productos = ''
    let hojas = ''

    orden =  (<HTMLInputElement>document.getElementById('orden_selected')).value;

    let separator = orden.split('-')

    console.log(separator[3]);




    orden = separator[1];
    console.log(separator[0],'<>',separator[1])

    let Ejemplares = this.TRABAJOS.find(x => x._id == orden);

    productos = (<HTMLInputElement>document.getElementById('productos_input')).value
    hojas = (<HTMLInputElement>document.getElementById('hojas_input')).value

    if(this.CompararTama(separator[0],separator[2],separator[3], hojas, productos) === 1){
      return
    }

    let restante = this.GESTIONES.filter(x=> x.orden == orden)

    let long = restante.length

    let _productos = 0;
    let _hojas = 0;

    if(long <= 0){
      console.log(orden)
      let Actual = this.TRABAJOS.find(x=> x._id == orden)
      console.log(Actual)
      _productos = Actual.orden.cantidad - Number(productos);
      _hojas = Actual.orden.paginas - Number(hojas)
    }else{
      _productos = restante[long - 1].Rproductos-Number(productos)
      _hojas = restante[long - 1].Rhojas - Number(hojas)
    }

    let data = {
      op:separator[0],
      orden : orden,
      fecha : hoy,
      maquina: Ejemplares.maquina._id,
      productos:productos,
      hojas:hojas,
      Rproductos:_productos,
      Rhojas:_hojas
    }

    this.api.postGestion(data)
      .subscribe((resp:any)=>{
        (<HTMLInputElement>document.getElementById('productos_input')).value = '';
        (<HTMLInputElement>document.getElementById('hojas_input')).value = '';
        this.modal_nueva_gestion();
        this.getGestiones();
      })


  }

  getGestiones(){
    this.api.getGestiones()
      .subscribe((resp:any)=>{
        this.GESTIONES = resp
      })
  }


  Tarea(){
    let hoy = moment().format('yyyy-MM-DD');
    this.TRABAJOS = []
    
    this.api.getTrabajos()
      .subscribe((resp:any)=>{

        let nuevo = resp.filter(x => x.maquina.tipo === this.FASE);

        if(nuevo){
          let Long = nuevo.length;
          for(let i=0; i<Long; i++){
    
            if(hoy >= nuevo[i].fechaI){
              if(hoy <= nuevo[i].fecha){
                this.TRABAJOS.push(nuevo[i])
              }
            }
    
          }
        }
      })
  }

  finalizar_gestion(id){
    let data = {id}
    this.api.finalizarTrabajo(data)
      .subscribe((resp:any)=>{
        Swal.fire({
          title:'Gestion finalizada',
          text:'La gestion fue finalizada con exito',
          showConfirmButton:false,
        })
        this.getGestiones();
        this.getMaquinas();
        this.Tarea();
      })
  }

  calcularHojas(x,y){
    return Math.ceil(x/y);
  }

  TraerTareasFueraDeFecha(){
    let hoy = moment().format('yyyy-MM-DD');
    this.TRABAJOS = []
    
    this.api.getTrabajos()
      .subscribe((resp:any)=>{

        let nuevo = resp.filter(x => x.maquina.tipo === this.FASE);
        if(nuevo){
          let Long = nuevo.length;
          for(let i=0; i<Long; i++){
    
            // if(hoy >= nuevo[i].fechaI){
            //   if(hoy <= nuevo[i].fecha){
              //   }
              // }
              
              this.TRABAJOS.push(nuevo[i])
              // console.log(this.GRUPOS)
            }
            
        }
      })
  }

}

