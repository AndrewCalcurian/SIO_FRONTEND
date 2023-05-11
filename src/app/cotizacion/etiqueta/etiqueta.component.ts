import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';




@Component({
  selector: 'app-etiqueta',
  templateUrl: './etiqueta.component.html',
  styleUrls: ['./etiqueta.component.css']
})
export class EtiquetaComponent implements OnInit {

  constructor(private api:RestApiService) { }

  public ordenes = []
  public valido:boolean = false;
  public orden;

  ngOnInit(): void {

    

    this.api.getOrden()
      .subscribe((resp:any)=>{
        this.ordenes = resp
      })

  }


  seleccionar_orden(e){
    if(e != '#'){
      this.valido = true;
      this.orden = e;
    }else{
      this.valido = false
    }
  }
  
  verEtiqueta(){
    const WindowPrt = window.open(`http://192.168.0.23:8080/etiqueta/${this.orden}`, '', 'left=300,top=300,width=400,height=300,toolbar=0,scrollbars=0,status=0');
    // window.open("http://localhost:4200/pruebas")
  }

}
