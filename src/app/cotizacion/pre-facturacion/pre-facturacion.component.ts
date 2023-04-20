import { Component, OnInit } from '@angular/core';
import { Cell, Img, Line, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pre-facturacion',
  templateUrl: './pre-facturacion.component.html',
  styleUrls: ['./pre-facturacion.component.css']
})
export class PreFacturacionComponent implements OnInit {

  constructor(private api:RestApiService) { }

  public Despachos
  public Tasa
  public Validacion:boolean = false
  public Modificacion:boolean = false
  public ModificaciondeEscala:boolean = false
  public ModificaciondePrecio:boolean = false

  ngOnInit(): void {
    this.api.getDespachosYOrdenes()
      .subscribe((resp:any)=>{
        this.Despachos = resp.preFacuracion
        this.Tasa = resp.MonitorBCV
        let split_dolar = resp.MonitorBCV.split(' ')
        this.Tasa = Number(split_dolar[1])
        console.log(this.Tasa)
      })
  }

  Editar_Cantidad_en_OC(){
    (<HTMLInputElement>document.getElementById('Cantidad_en_OC')).disabled = false
  }

  Editar_Cantidad_despachada(){
    (<HTMLInputElement>document.getElementById('Cantidad_Despachada')).disabled = false
  }

  Modificacion_close(){
    this.Modificacion = false;
    this.ModificaciondeEscala = false;
    this.ModificaciondePrecio = false;
  }

  closeModal(){
    this.Validacion = false;
  }

  buscarEscala_(i){
    Swal.fire({
      text:'Escala modificada',
      icon:'success',
      showConfirmButton:false
    })
    this.Modificacion_close();
    this.buscarEscala(i)
  }

  public Escala = {cantidad:0, precio:0};
  buscarEscala(precio){
    console.log(precio)
    let escalas = this.Despachos[this.INDEX].escala.escalas
    let search = escalas.findLast(x=> x.cantidad <= precio)
    this.Escala = search
    console.log(this.Escala)
  }

  public INDEX = 0;
  ValidarDatos(i){
    if(!this.Validacion){
      this.Validacion = true;
      this.INDEX = i
      // let busqueda = this.Despachos[this.INDEX].find(x=>x.escala.escalas.cantidad === "100000")
      this.buscarEscala(this.Despachos[this.INDEX].orden.cantidad)
    }else{
      this.closeModal();
    }
  }

  modificarModal(i){
    this.Modificacion = true;
    if(i === 'escala'){
      this.ModificaciondeEscala = true
    }
    if(i === 'precio'){
      this.ModificaciondePrecio = true
    }
  }

  puntoYcoma(n){
    if(!n){
      return 0
    }
    n = Number(n).toFixed(2)
    return n = new Intl.NumberFormat('de-DE').format(n)
  }

  descargarPDF(){


    let cliente = this.Despachos[this.INDEX].orden.cliente.nombre
    let rif = this.Despachos[this.INDEX].orden.cliente.rif
    let direccion = this.Despachos[this.INDEX].orden.cliente.direccion
    let producto = this.Despachos[this.INDEX].orden.producto.producto
    let codigo = this.Despachos[this.INDEX].orden.producto.cod_cliente
    let sustrato = ''
    let colores = '0'
    let procesos = 'Barnizado'
    let cantidad = this.Despachos[this.INDEX].despacho.cantidad
    cantidad = this.puntoYcoma(cantidad)

    let escale
    escale = this.puntoYcoma(this.Escala.cantidad)
    let tasa
    tasa = this.puntoYcoma(this.Tasa)
    let precioUSD
    precioUSD = this.puntoYcoma(this.Despachos[this.INDEX].despacho.cantidad / 1000 * this.Escala.precio)
    let precioBS
    precioBS = this.puntoYcoma((this.Despachos[this.INDEX].despacho.cantidad / 1000 * this.Escala.precio)*this.Tasa)

    
    let contactos
    let cargos

    for(let i=0;i<this.Despachos[this.INDEX].orden.cliente.contactos.length;i++){
      if(i === 0){
        console.log(this.Despachos[this.INDEX].orden.cliente.contactos[i].trato)
        contactos = `${this.Despachos[this.INDEX].orden.cliente.contactos[i].trato} ${this.Despachos[this.INDEX].orden.cliente.contactos[i].nombre}`
        cargos = `${this.Despachos[this.INDEX].orden.cliente.contactos[i].cargo}`
      }
    }
    console.log(this.Despachos[this.INDEX].orden.cliente)
    for(let i=0;i<this.Despachos[this.INDEX].orden.producto.post.length;i++){
      procesos = procesos +', '+this.Despachos[this.INDEX].orden.producto.post[i];
    }
    for(let i=0;i<this.Despachos[this.INDEX].orden.producto.materiales[this.Despachos[this.INDEX].orden.montaje].length;i++)
    {
      let material = this.Despachos[this.INDEX].orden.producto.materiales[this.Despachos[this.INDEX].orden.montaje][i]
      console.log(material.producto.grupo.nombre)
      if(material.producto.grupo.nombre === 'Sustrato'){
        sustrato = `${material.producto.nombre} ${material.producto.gramaje}g, calibre:${material.producto.calibre}`
      }else if(material.producto.grupo.nombre === 'Tinta'){
        let Numer = Number(colores) + 1;
        colores = Numer.toString()
      }
    }

    const pdf = new PdfMakeWrapper();
    PdfMakeWrapper.setFonts(pdfFonts);

    
    async function generarPDF(){
      // pdf.footer();

      pdf.add(
        new Table([
          [
            new Cell(await new Img('../../assets/poli_cintillo.png').width(85).margin([20, 5]).build()).rowSpan(4).end,
            new Cell(new Txt(`
            COTIZACIÓN`).bold().end).alignment('center').fontSize(13).rowSpan(4).end,
            new Cell(new Txt('Código: FDE-001').end).fillColor('#dedede').fontSize(7).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('N° de Revisión: 0').end).fillColor('#dedede').fontSize(7).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('Fecha de Revision: 14/04/2023').end).fillColor('#dedede').fontSize(7).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('Página: 1 de 1').end).fillColor('#dedede').fontSize(7).alignment('center').end,
          ],
        ]).widths(['25%','50%','25%']).end
      )

      pdf.add(
        pdf.ln(1)
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Table([
              [
                new Cell(new Txt('COTIZACIÓN').bold().end).colSpan(2).alignment('center').fillColor('#000000').color('#ffffff').end,
                new Cell(new Txt('').end).end,
              ],
              [
                new Cell(new Txt('N°').alignment('center').end).end,
                new Cell(new Txt('C-23-0001').bold().color('#FF0000').alignment('center').end).end,
              ],
              [
                new Cell(new Txt('Fecha').alignment('center').end).end,
                new Cell(new Txt('17/04/2023').alignment('center').end).end,
              ],
            ]).widths(['25%','75%']).end).end,

          ],
        ]).widths(['25%','40%','35%']).layout('noBorders').end
      )

      pdf.add(
        pdf.ln(3)
      )

      pdf.add(
        new Table([
          [
            new Cell(
              new Table([
                [
                  new Cell(new Txt('Cliente:').bold().end).end,
                ],
                [
                  new Cell(new Txt(cliente).end).end,

                ],
                [
                  new Cell(new Txt('').end).end,

                ],
                [
                  new Cell(new Txt('Rif:').bold().end).end,
                ],
                [
                  new Cell(new Txt(rif).end).end,

                ],
                [
                  new Cell(new Txt('').end).end,

                ],
                [
                  new Cell(new Txt('Dirección Fiscal:').bold().end).end,
                ],
                [
                  new Cell(new Txt(direccion).end).end,

                ]
              ]).layout('noBorders').end,
              
            ).end,
            new Cell(
              new Table([
                [
                  new Cell(new Txt('Contactos:').bold().end).end,
                ],
                [
                  new Cell(new Txt(contactos).end).end,

                ],
                [
                  new Cell(new Txt(cargos).italics().fontSize(9).end).end,

                ]
              ]).layout('noBorders').end,
              
            ).end,
            
          ]

        ]).widths(['65%','35%']).layout('noBorders').end
      )

      pdf.add(
        pdf.ln(1)
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('Producto:').bold().end).end,
            new Cell(new Txt(producto).end).end,
          ],
          [
            new Cell(new Txt('Código:').bold().end).end,
            new Cell(new Txt(codigo).end).end,
          ],
          [
            new Cell(new Txt('Sustrato:').bold().end).end,
            new Cell(new Txt(sustrato).end).end,
          ],
          [
            new Cell(new Txt('Colores:').bold().end).end,
            new Cell(new Txt(colores).end).end,
          ],
          [
            new Cell(new Txt('Procesos:').bold().end).end,
            new Cell(new Txt(procesos).end).end,
          ],
        ]).layout('noBorders').end
      )

      pdf.add(
        pdf.ln(1)
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('Cantidad:').bold().margin([5,5]).alignment('center').end).fillColor('#dedede').end,
            new Cell(new Txt('Escala:').bold().margin([5,5]).alignment('center').end).fillColor('#dedede').end,
            new Cell(new Txt('Precio/millar (USD):').bold().alignment('center').end).fillColor('#dedede').end,
            new Cell(new Txt('Tasa de cambio (BCV):').bold().alignment('center').end).fillColor('#dedede').end,
            new Cell(new Txt('Precio/millar (Bs):').bold().alignment('center').end).fillColor('#dedede').end,
          ],
          [
            new Cell(new Txt(cantidad).alignment('center').end).end,
            new Cell(new Txt(escale).alignment('center').end).end,
            new Cell(new Txt(precioUSD).alignment('center').end).end,
            new Cell(new Txt(tasa).alignment('center').end).end,
            new Cell(new Txt(precioBS).alignment('center').end).end,
          ]
        ]).widths(['20%','20%','20%','20%','20%']).end
      )

      pdf.add(
        pdf.ln(1)
      )

      pdf.add(
        new Table([
          [
            new Cell(new Txt('Observaciones:').bold().end).end,
          ],
          [
            new Cell(new Txt('"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ').end).end,
          ]
        ]).layout('noBorders').end
      )

      pdf.add(
        pdf.ln(4)
      )


      pdf.add(
        new Table([
          [
            new Cell(new Txt('Emitido por:').bold().end).end,
          ],
          [
            new Cell(new Txt('Attilio Granone').end).end,
          ],
          [
            new Cell(new Txt('Director General').italics().fontSize(9).end).end,
          ],
          [
            new Cell(new Txt('Firma').end).end,
          ],
        ]).layout('noBorders').end
      )

      pdf.add(
        pdf.ln(3)
      )
      
      pdf.add(
        new Txt('Calle Pantín,  Local Galpón Nro 29, Urb. Chacao-Caracas, Miranda, Venezuela. ZP: 1060,').italics().fontSize(9).alignment('center').end
      )
      pdf.add(
        new Txt('email: info@poligraficaindustrial.com').italics().fontSize(9).alignment('center').end
      )

      pdf.create().download(`test`)
    }

    generarPDF();
  }



}
