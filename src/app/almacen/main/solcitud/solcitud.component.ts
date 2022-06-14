import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-solcitud',
  templateUrl: './solcitud.component.html',
  styleUrls: ['./solcitud.component.css']
})
export class SolcitudComponent implements OnInit {

  public ordenes:any;


  @Input() solicitud:any
  @Input() orden:any
  @Output() onCloseModal = new EventEmitter();

  constructor(public api:RestApiService) { }

  ngOnInit(): void {
  }

  onClose(){
    this.solicitud = false;
    this.onCloseModal.emit();
  }

}
