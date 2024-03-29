import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../services/rest-api.service';

import { PdfMakeWrapper, Txt, Img, Table, Cell, Columns, Stack } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css']
})
export class OrdenComponent implements OnInit {

  public id!:any;
  public PRODUCTO;
  public Maquinas;
  public listo:boolean = true;
  public loading:boolean = true;
  public necesidad;
  public demasia;
  public cantidad;
  public usuario;

  constructor(private route:ActivatedRoute,
              private api:RestApiService) { 
    this.usuario = api.usuario
    this.id = this.route.snapshot.paramMap.get('id');
  }

  public hojas_imprimir
  public hojas_demasia
  ngOnInit(): void {
    this.api.getOrdenById(this.id)
      .subscribe((resp:any)=>{
        this.loading = true;
        this.PRODUCTO = resp;
        this.getMaquinas(this.PRODUCTO._id)
        this.cantidad = new Intl.NumberFormat('de-DE').format(this.PRODUCTO.cantidad)
        this.demasia = Math.ceil(this.PRODUCTO.demasia * 100 / this.PRODUCTO.paginas);
        let ejemplares_montados = this.PRODUCTO.producto.ejemplares[this.PRODUCTO.montaje]
        let paginas_sin_demasia = this.PRODUCTO.cantidad /  ejemplares_montados;
        this.hojas_imprimir = Math.ceil(this.PRODUCTO.cantidad / this.PRODUCTO.producto.ejemplares[this.PRODUCTO.montaje])
        this.hojas_demasia = Math.ceil(this.PRODUCTO.demasia * this.hojas_imprimir / 100)
        // this.PRODUCTO.demasia = Math.ceil(this.demasia * paginas_sin_demasia / 100);
        // this.PRODUCTO.demasia = this.PRODUCTO.producto.ejemplares[this.PRODUCTO.montaje]
        // // console.log(this.PRODUCTO, 'este es el Producto');
        this.loading = false;
      })
  }

  cancelarOrden(){
    Swal.fire({
      icon:'info',
      title: `¿Cancelar Orden ${this.PRODUCTO.sort}?` ,
      text:'Describe brevemente el motivo',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Cancelar orden',
      cancelButtonText:'No cancelar',
      showLoaderOnConfirm: true,
      cancelButtonColor:'#f14668',
      confirmButtonColor:'#48c78e',
      preConfirm: (login) => {
        return fetch(`//localhost:8080/api/orden/cancelar/${this.PRODUCTO._id}/${login}`)
          .then(response => {
            if (!response.ok) {
              // console.log(response)
              throw new Error('Debes indicar un motivo')
            }
            return response.json()
          })
          .catch(error => {
            Swal.showValidationMessage(
              `No se pudo cancelar: ${error}`
            )
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `${result.value}`,
          text:`La orden ${this.PRODUCTO.sort} fué cancelada`,
          icon:'success',
          showConfirmButton:false
        })
      }
    })
  }

  getMaquinas(orden){
    this.api.getMaquinasByOrdens(orden)
      .subscribe((resp:any)=>{
        this.Maquinas = resp;
      })

  }

  FinalizarEdicion(){
    this.api.putOrden(this.PRODUCTO, this.PRODUCTO._id)
      .subscribe((resp:any)=>{
        this.EditarOrden()
      })
  }

  public edicion:boolean = false;
  EditarOrden(){
    if(!this.edicion){
      this.edicion = true;
    }else{
      this.edicion = false
    }
  }

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

  Aprox(x,y){
    let z = x/y;
    Number(z)
    z = Math.ceil(z)
    return z;
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

  descargarPDF(){

    let PRODUCTO = this.PRODUCTO
    let hojas_demasia = this.hojas_demasia
    let hojas_imprimir = this.hojas_imprimir
    // // console.log(this.PRODUCTO)
    
    PRODUCTO.fecha_o = moment(PRODUCTO.fecha_o).utc().format('DD/MM/yyyy');
    PRODUCTO.fecha_s = moment(PRODUCTO.fecha_s).utc().format('DD/MM/yyyy');
    PRODUCTO.fecha = moment(PRODUCTO.fecha).format('DD/MM/yyyy');

    // PRODUCTO.fecha_o = new Date(PRODUCTO.fecha_o).toLocaleDateString('es-ES');
    // PRODUCTO.fecha_s = new Date(PRODUCTO.fecha_s).toLocaleDateString('es-ES');
    // PRODUCTO.fecha = new Date(PRODUCTO.fecha).toLocaleDateString('es-ES');

    PRODUCTO.cantidad_ = new Intl.NumberFormat('de-DE').format(PRODUCTO.cantidad)

    if(!PRODUCTO.usuario){
      PRODUCTO.usuario = ' '
    }
    
    
    let montajes = this.NumToLet(PRODUCTO.montaje);
    let maquinas = this.Maquinas.maquinasDB
    let maquina = []
    
    let peliculas = [];
    let demasia = this.demasia

    let materiales = PRODUCTO.producto.materiales[PRODUCTO.montaje];
    
    let tintas = materiales.filter(x => x.producto.grupo.nombre === 'Tinta')
    let sustrato = materiales.filter(x => x.producto.grupo.nombre === 'Sustrato')
    let barniz = materiales.filter(x => x.producto.grupo.nombre === 'Barniz' || x.producto.grupo.nombre === 'Barniz Acuoso')
    let cantidad_barniz;
    let b_name = ''
    let b_marc = ''
    let b_und = ''

    if(barniz.length > 0){

      // barniz[0].producto.nombre} (${barniz[0].producto.marca} - ${cantidad_barniz}${barniz[0].producto.unidad

      b_name = barniz[0].producto.nombre;
      b_marc = barniz[0].producto.marca;
      b_und = barniz[0].producto.unidad
      let cant_barniz = (barniz[0].cantidad * PRODUCTO.paginas)/1000;
      cantidad_barniz = cant_barniz.toFixed(2)

    }else{
      cantidad_barniz = 'N/A';
    }

    let pega = materiales.filter(x => x.producto.grupo.nombre === 'Pega')
    // // console.log(pega,'pegaa')
    let cantidad_pega;
    let pega_nombre = '';
    let pega_marca = '';
    let pega_unidad = '';
    if(pega.length == 0){
      cantidad_pega = 'N/A'
    }else{
      let cant_pega = (pega[0].cantidad * PRODUCTO.cantidad)/1000;
      cantidad_pega = cant_pega.toFixed(2)
      pega_nombre = pega[0].producto.nombre
      pega_marca = pega[0].producto.marca
      pega_unidad =pega[0].producto.unidad
    }
    let caja = materiales.filter(x => x.producto.grupo.nombre === 'Cajas Corrugadas')
    let cant_cajas = 0;
    let cinta_ = 0;
    if(caja[0]){
      cant_cajas = Math.ceil(PRODUCTO.cantidad / caja[0].cantidad)
      cinta_ = caja[0].producto.cinta * cant_cajas;
    }else{
      caja = [];
      caja.push({producto:{nombre:'N/A'},cantidad:'N/A'})
    }
    let cantidad_cajas = Math.ceil(cant_cajas)
    let cinta = materiales.filter(x => x.producto.grupo.nombre === 'Cinta de Embalaje')
    let Medida_Sustrato = ``;
    let Nombre_sustrato = ``
    let direccion_fibra = ``
    if(!sustrato[0]){
      Nombre_sustrato  = 'N/A'
      Medida_Sustrato = 'N/A'
      direccion_fibra = 'N/A'
    }else{
      direccion_fibra = `${sustrato[0].producto.largo}`
      Medida_Sustrato = `${sustrato[0].producto.ancho} x ${sustrato[0].producto.largo}`
      Nombre_sustrato = `${sustrato[0].producto.nombre} ${sustrato[0].producto.marca} (Calibre:${sustrato[0].producto.calibre}, Gramaje:${sustrato[0].producto.gramaje})`
    }
    let tintas_color = []
    let tintas_marca = []
    
    let Estandar_de_color = ''

    if(PRODUCTO.e_c){
      Estandar_de_color = 'SI'
    }else{
      Estandar_de_color = 'NO'
    }
    
    let _i = 5;
    for(let i = 0; i<tintas.length; i++){
      if(tintas[i].producto.color === 'Negro'){
        let peli = `Negro: ${PRODUCTO.cliente.codigo}-${PRODUCTO.producto.codigo}-${PRODUCTO.producto.version}-${montajes}-1`;
        peliculas.push(peli)
      }else if(tintas[i].producto.color === 'Cyan'){
        let peli = `Cyan: ${PRODUCTO.cliente.codigo}-${PRODUCTO.producto.codigo}-${PRODUCTO.producto.version}-${montajes}-2`;
        peliculas.push(peli)
      }else if(tintas[i].producto.color === 'Magenta'){
        let peli = `Magenta: ${PRODUCTO.cliente.codigo}-${PRODUCTO.producto.codigo}-${PRODUCTO.producto.version}-${montajes}-3`;
        peliculas.push(peli)
      }else if(tintas[i].producto.color === 'Amarillo'){
        let peli = `Amarillo: ${PRODUCTO.cliente.codigo}-${PRODUCTO.producto.codigo}-${PRODUCTO.producto.version}-${montajes}-4`;
        peliculas.push(peli)
      }else{
        let peli = `${tintas[i].producto.color}: ${PRODUCTO.cliente.codigo}-${PRODUCTO.producto.codigo}-${PRODUCTO.producto.version}-${montajes}-${_i++}`;
        peliculas.push(peli)
      }
      tintas_color.push(tintas[i].producto.color)
      let cantidad = (tintas[i].cantidad * this.PRODUCTO.paginas)/1000;
      cantidad = Number(cantidad)
      let cantidad_tinta = cantidad.toFixed(2)
      let tinta = `${tintas[i].producto.color}: ${tintas[i].producto.nombre}(${tintas[i].producto.marca} - ${cantidad_tinta}${tintas[i].producto.unidad})`
      tintas_marca.push(tinta)
    }

    for(let i=0; i<maquinas.length;i++){
      maquina.push(maquinas[i].maquina.nombre);
    }
    
    
    if(PRODUCTO.montaje == 1){
      PRODUCTO.paginas = hojas_demasia + hojas_imprimir
    }
    
    
    const pdf = new PdfMakeWrapper();
    PdfMakeWrapper.setFonts(pdfFonts);

    
    async function generarPDF(){
      pdf.add(
        new Table([
          [
            new Cell(await new Img('../../assets/poli_cintillo.png').width(85).margin([20, 5]).build()).rowSpan(4).end,
            new Cell(new Txt(`
            ORDEN DE PRODUCCIÓN`).bold().end).alignment('center').fontSize(13).rowSpan(4).end,
            new Cell(new Txt('Código: FPR-008').end).fillColor('#dedede').fontSize(7).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('N° de Revisión: 0').end).fillColor('#dedede').fontSize(7).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('Fecha de Revision: 24/05/2022').end).fillColor('#dedede').fontSize(7).alignment('center').end,
          ],
          [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('Página: 1 de 5').end).fillColor('#dedede').fontSize(7).alignment('center').end,
          ],
        ]).widths(['25%','50%','25%']).end
      )

      pdf.add(
        pdf.ln(1)
      )

      pdf.add(
        new Table([
          [
            new Cell(new Table([
              [
                new Cell(new Txt('ORDEN DE COMPRA').bold().end).colSpan(2).alignment('center').fillColor('#000000').color('#ffffff').fontSize(9).end,
                new Cell(new Txt('').end).end,
              ],
              [
                new Cell(new Txt('N°').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.orden}`).end).fontSize(9).end
              ],
              [
                new Cell(new Txt('Fecha de OC:').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.fecha_o}`).margin([0,6]).end).fontSize(9).end
              ]
            ]).widths(['40%','60%']).end
            ).end,

            new Cell(new Table([
              [
                new Cell(new Txt('PRODUCTO').bold().end).colSpan(2).alignment('center').fillColor('#000000').color('#ffffff').fontSize(9).end,
                new Cell(new Txt('').end).end,
              ],
              [
                new Cell(new Txt('NOMBRE:').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.producto.producto}`).end).fontSize(12).end
              ],
              [
                new Cell(new Txt('CÓDIGO:').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.cliente.codigo}-${PRODUCTO.producto.codigo}-${PRODUCTO.producto.version}`).end).fontSize(12).end
              ]
            ]).widths(['25%','75%']).end
            ).end,

            new Cell(new Table([
              [
                new Cell(new Txt('ORDEN DE PRODUCCIÓN').bold().end).colSpan(2).alignment('center').fillColor('#000000').color('#ffffff').fontSize(9).end,
                new Cell(new Txt('').end).end,
              ],
              [
                new Cell(new Txt('N°:').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.sort}`).bold().end).fontSize(15).end
              ],
              [
                new Cell(new Txt('FECHA DE EMISIÓN:').end).fillColor('#dedede').fontSize(8).end,
                new Cell(new Txt(`${PRODUCTO.fecha}`).margin([0,6]).end).fontSize(9).end
              ]
            ]).widths(['40%','60%']).end
            ).end,

          ],
          
        ]).layout('noBorders').widths(['30%','40%','30%']).end

      )
      pdf.add(
        new Table([
          [
            new Cell(new Table([
              [
                new Cell(new Txt('INFORMACIÓN DEL PRODUCTO').bold().end).colSpan(2).alignment('center').fillColor('#000000').color('#ffffff').fontSize(9).end,
                new Cell(new Txt('').end).end,
              ],
              [
                new Cell(new Txt('CLIENTE:').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.cliente.nombre}`).end).fontSize(12).end
              ],
              [
                new Cell(new Txt('CÓDIGO DE PRODUCTO DEL CLIENTE:').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.producto.cod_cliente}`).end).fontSize(12).end
              ],
              [
                new Cell(new Txt('CÓDIGO DE ESPECIFICACIÓN:').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt(`E-${PRODUCTO.cliente.codigo}-${PRODUCTO.producto.codigo}-${PRODUCTO.producto.version}-${PRODUCTO.producto.edicion}`).end).fontSize(12).end
              ]
            ]).widths(['40%','60%']).end
            ).end,

          ],
          
        ]).layout('noBorders').widths(['100%']).end

      )
      pdf.add(
        new Table([
          [
            new Cell(new Table([
              [
                new Cell(new Txt('PLANIFICACIÓN DE ENTREGAS').bold().end).colSpan(4).alignment('center').fillColor('#000000').color('#ffffff').fontSize(9).end,
                new Cell(new Txt('').end).end,
                new Cell(new Txt('').end).end,
                new Cell(new Txt('').end).end,

              ],
              [
                new Cell(new Txt('N°:').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt('CANTIDAD:').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt('FECHA SOLICITADA:').end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt('LUGAR DE ENTREGA:').end).fillColor('#dedede').fontSize(9).end,
              ],
              [
                new Cell(new Txt(`1`).end).fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.cantidad_}`).end).fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.fecha_s}`).end).fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.almacen}`).end).fontSize(9).end
              ],
              [
                new Cell(new Txt(`TOTAL`).end).fillColor('#dedede').fontSize(9).end,
                new Cell(new Txt(`${PRODUCTO.cantidad_}`).end).fontSize(9).end,
                new Cell(new Txt(``).end).border([false]).fontSize(9).end,
                new Cell(new Txt(``).end).border([false]).fontSize(9).end
              ],
            ]).widths(['7%','31%','31%','31%']).end
            ).end,

          ],
          
        ]).layout('noBorders').widths(['100%']).end

      )
      pdf.ln(2)
      pdf.add(
        new Table([
          [
            new Cell(new Table([
              [
                new Cell(new Txt('CARACTERÍSTICAS Y MATERIALES ').bold().end).alignment('center').fillColor('#000000').color('#ffffff').fontSize(9).end,
              ],
              [
                new Cell(
                  new Table([
                    [
                      new Cell(new Table([
                        [
                          new Cell(new Txt('PRE-IMPRESIÓN').end).fillColor('#dedede').fontSize(9).end,
                        ],
                        [
                          new Cell(new Table([
                            [
                              new Cell(new Table([
                                [
                                  new Cell(new Txt('CÓDIGO DEL MONTAJE').end).alignment('center').fillColor('#dedede').fontSize(9).end,
                                ],
                                [
                                  new Cell(new Txt(`M-${PRODUCTO.cliente.codigo}-${PRODUCTO.producto.codigo}-${PRODUCTO.producto.version}-${montajes}`).end).end
                                ],
                                [
                                  new Cell(new Txt('CANTIDAD DE EJEMPLARES').end).alignment('center').fillColor('#dedede').fontSize(9).end,
                                ],
                                [
                                  new Cell(new Txt(`${PRODUCTO.producto.ejemplares[PRODUCTO.montaje]}`).end).end
                                ]
                              ]).widths(['100%']).end
                              ).fontSize(9).end,
                              new Cell(
                                new Table([
                                [
                                  new Cell(new Txt('CÓDIGO DE PELICULAS').end).alignment('center').fillColor('#dedede').fontSize(9).end,
                                ],
                                [
                                  new Stack(peliculas).fontSize(9).end
                                ]
                              ]).widths(['100%']).end
                              ).end,
                            ],
                          ]).layout('noBorders').widths(['50%', '50%']).end
                          ).end,
                        ]
                      ]).layout('noBorders').widths(['100%']).end
                      ).border([false]).fillColor('#ffffff').end,
                    ], //FINAL PRE-IMPRESION
                    [
                      new Cell(new Table([
                        [
                          new Cell(new Txt('IMPRESIÓN').end).fillColor('#dedede').fontSize(9).end,
                        ],
                        [
                          new Cell(new Table([
                            [
                              new Cell(new Table([
                                [
                                  new Cell(new Txt('SUSTRATO').end).alignment('center').fillColor('#dedede').fontSize(9).end,
                                  new Cell(new Txt('TAMAÑO ORIGINAL').end).alignment('center').fillColor('#dedede').fontSize(9).end,
                                ],
                                [
                                  new Cell(new Txt(Nombre_sustrato).end).fontSize(11).end,
                                  new Cell(new Txt(Medida_Sustrato).end).alignment('center').fontSize(11).end,
                                ],
                                [
                                  new Cell(new Txt('DIRECCIÓN DE FIBRA').end).alignment('center').fillColor('#dedede').fontSize(9).end,
                                  new Cell(new Txt('TAMAÑO A IMPRIMIR').end).alignment('center').fillColor('#dedede').fontSize(9).end,
                                ],
                                [
                                  new Cell(new Txt(direccion_fibra).end).alignment('center').fontSize(11).end,
                                  new Cell(new Txt(`${PRODUCTO.i_ancho} x ${PRODUCTO.i_largo}`).end).alignment('center').fontSize(11).end,
                                ]


                              ]).widths(['60%','40%']).end
                              ).fontSize(9).end,



                              // new Cell(new Table([
                              //   [
                              //     new Cell(new Txt('% DEMASIA').end).fillColor('#dedede').lineHeight(0.5).fontSize(9).end,
                              //     new Cell(new Txt(demasia).end).fontSize(11).alignment('center').end,
                              //   ],
                              //   [
                              //     new Cell(new Txt('HOJAS DE DEMASIA').end).fillColor('#dedede').fontSize(9).end,
                              //     new Cell(new Txt(PRODUCTO.demasia).end).fontSize(11).alignment('center').end,
                              //   ],
                              //   [
                              //     new Cell(new Txt('HOJAS A IMPRIMIR').end).fillColor('#dedede').fontSize(9).end,
                              //     new Cell(new Txt(`${PRODUCTO.paginas - demasia}`).end).fontSize(11).alignment('center').end,
                              //   ],
                              //   [
                              //     new Cell(new Txt('TOTAL DE HOJAS POR ASIGNAR').end).fillColor('#dedede').fontSize(9).end,
                              //     new Cell(new Txt(PRODUCTO.paginas).end).fontSize(11).alignment('center').end,
                              //   ]
                              // ]).widths(['80%','20%']).end
                              // ).fontSize(9).end,

                              new Cell(new Table([
                                [
                                  new Cell(new Txt('% DEMASÍA').end).fillColor('#dedede').alignment('center').fontSize(9).end,
                                  new Cell(new Txt('HOJAS DE DEMASÍA:').end).fillColor('#dedede').alignment('center').fontSize(9).end,
                                ],
                                [
                                  new Cell(new Txt(PRODUCTO.demasia).end).fontSize(10).alignment('center').end,
                                  new Cell(new Txt(hojas_demasia).end).fontSize(10).alignment('center').end,
                                ],
                                [
                                  new Cell(new Txt('HOJAS A IMPRIMIR:').end).fillColor('#dedede').alignment('center').fontSize(9).end,
                                  new Cell(new Txt('TOTAL HOJAS A ASIGNAR:').end).fillColor('#dedede').alignment('center').fontSize(9).end,
                                ],
                                [
                                  new Cell(new Txt(hojas_imprimir).bold().end).fontSize(12).alignment('center').end,
                                  new Cell(new Txt(PRODUCTO.paginas).bold().end).fontSize(12).alignment('center').end,
                                ]
                              ]).widths(['50%','50%']).end
                              ).end,
                            ],
                            [
                              new Cell(new Table([
                                [
                                  new Cell(new Txt('BARNIZ').end).alignment('center').fillColor('#dedede').alignment('center').fontSize(9).end,
                                  new Cell(new Txt('ESTÁNDAR DE COLOR:').alignment('center').end).fillColor('#dedede').alignment('center').fontSize(7).end,
                                ],
                                [
                                  new Cell(new Txt(`${b_name} (${b_marc} - ${cantidad_barniz}${b_und})`).end).fontSize(9).end,
                                  // new Cell(new Txt(`N/A`).end).fontSize(9).end,
                                  new Cell(new Txt(Estandar_de_color).end).alignment('center').fontSize(9).end
                                ]
                              ]).widths(['70%','30%']).end
                              ).fontSize(9).end,
                              new Cell(new Table([
                                [
                                  new Cell(new Txt('TINTA').end).alignment('center').fillColor('#dedede').fontSize(9).end
                                ],
                                [
                                  new Cell(new Stack(tintas_marca).end).fontSize(9).end
                                ],
                              ]).widths(['100%']).end
                              ).fontSize(9).end,
                              // new Cell(new Txt('').end).end
                            ]
                          ]).layout('noBorders').widths(['50%', '50%']).end
                        // ]).layout('noBorders').widths(['33%', '27%', '40%']).end
                          ).end
                        ]
                      ]).layout('noBorders').widths(['100%']).end
                      ).border([false]).fillColor('#ffffff').end
                    ],
                    [
                      new Cell(new Table([
                        [
                          new Cell(new Txt('POST-IMPRESIÓN').end).fillColor('#dedede').fontSize(9).end,
                        ],
                        [
                          new Cell(new Table([
                            [
                              new Cell(new Table([
                                [
                                  new Cell(new Stack(PRODUCTO.producto.post).end).fontSize(9).border([false]).end,
                                ],
                                [
                                  new Cell(new Txt('TIPO DE PEGA').alignment('center').end).fillColor('#dedede').fontSize(9).end,
                                ],
                                [
                                  new Cell(new Txt(`${pega_nombre} (${pega_marca} - ${cantidad_pega}${pega_unidad})`).end).fontSize(9).end
                                ]
                              ]).widths(['100%']).end
                              ).end,

                              new Cell(new Table([
                                [
                                  new Cell(new Txt('CÓDIGO DE CAJA').end).alignment('center').fillColor('#dedede').fontSize(9).end,
                                ],
                                [
                                  new Cell(new Txt(`${caja[0].producto.nombre} (${caja[0].cantidad} Unidades por Caja / ${cantidad_cajas} Cajas necesarias)`).end).fontSize(9).end
                                ],
                                [
                                  new Cell(new Txt('CINTA DE EMBALAJE').end).alignment('center').fillColor('#dedede').fontSize(9).end,
                                ],
                                [
                                  new Cell(new Txt(`${(cinta_).toFixed(2)}m`).end).fontSize(9).end
                                ]
                              ]).widths(['100%']).end
                              ).end
                              
                            ]
                            
                          ]).layout('noBorders').widths(['50%', '50%']).end
                          ).end
                        ]

                      ]).layout('noBorders').widths(['100%']).end
                      ).border([false]).fillColor('#ffffff').end
                    ],
                  ]).widths(['100%']).end
                ).end
              ]
            ]).layout('noBorders').widths(['100%']).end
            ).end,

          ],
          
        ]).layout('noBorders').widths(['100%']).end

      )
      pdf.add(
        new Table([
          [
            new Cell(new Txt('EQUIPOS').end).alignment('center').fillColor('#000000').color('#ffffff').fontSize(9).end,
            new Cell(new Txt('OBSERVACIONES').end).alignment('center').fillColor('#000000').color('#ffffff').fontSize(9).end,
            new Cell(new Txt('ELABORADO POR:').end).alignment('center').fillColor('#000000').color('#ffffff').fontSize(9).end,
          ],
          [
            new Cell(new Stack(maquina).end).fontSize(9).end,
            new Cell(new Txt(PRODUCTO.observacion).end).fontSize(9).end,
            new Cell(new Txt(`Firma:${PRODUCTO.usuario}
          
            Fecha:${PRODUCTO.fecha}`).end).fontSize(9).end
          ]

        ]).widths(['34%','33%','33%']).end
      )


      // pdf.add(
      //   new Table([
      //     [
      //       new Cell( await new Img('../../assets/Poligrafica_black_P.png').build()).end,
      //       new Cell( new Table([[new Cell(new Txt('ORDEN DE PRODUCCIÓN').end).fillColor('#dedede').fontSize(9).end],
      //                             [new Cell(new Txt(`${PRODUCTO.sort}`).end).fontSize(30).end],
      //                             [new Cell(new Txt(`FECHA DE EMISION: ${fecha1}`).end).fontSize(8).end]
      //                           ]).end).alignment('center').end
      //     ]
      //   ]).widths(['70%','30%']).layout('noBorders').end
      // )
      // pdf.add(

      //   pdf.ln(2)
        
      // )
      // pdf.add(
      //   new Table([
      //     [
      //       new Cell( new Txt(`CLIENTE: ${PRODUCTO.cliente.nombre}`).end).end,
      //       new Cell( new Txt(`O.C.: ${PRODUCTO.orden}`).end).end,
      //     ],
      //     [
      //       new Cell( new Txt(`PRODUCTO: ${PRODUCTO.cliente.codigo} - ${PRODUCTO.producto.codigo} ${PRODUCTO.producto.producto}`).end).colSpan(2).end,
      //       ''
      //     ]
      //   ]).widths(['60%','40%']).end
      // )
      // pdf.add(
      //   new Table([
      //     [
      //       new Cell( new Txt('ENTREGAS').end).fillColor('#dedede').end
      //     ]
      //   ]).widths(['100%']).alignment('center').layout('noBorders').end
      // )
      // pdf.add(
      //   new Table([
      //     [
      //       'N° ENTREGA','CANTIDAD','FECHA','OBSERVACIÓN'
      //     ],
      //     [
      //       '1',
      //       new Cell( new Txt(`${PRODUCTO.cantidad}`).end).end,
      //       new Cell( new Txt(`${PRODUCTO.fecha_s}`).end).end,
      //       ''
      //     ],
      //     [
      //       'TOTAL',
      //       new Cell( new Txt(`${PRODUCTO.cantidad}`).end).end,
      //       new Cell( new Txt('').end).border([false, false]).end,
      //       new Cell( new Txt('').end).border([false, false]).end
      //     ]
      //   ]).widths(['24%','24%','24%','28%']).end
      // )
      // pdf.add(
      //   new Table([
      //     [
      //       new Cell( new Txt('MONTAJE Y DESARROLLO').end).fillColor('#dedede').end
      //     ]
      //   ]).widths(['100%']).alignment('center').layout('noBorders').end
      // )
      // pdf.add(
      //   new Table([
      //     [
      //       'VERSIÓN','IMPRESIÓN','POST-IMPRESION'
      //     ],
      //     [
      //       new Cell( new Txt(`${PRODUCTO.producto.version}`).end).end,
      //       new Cell( new Stack(materiales).end).end,
      //       new Cell( new Stack(PRODUCTO.producto.post).end).end
      //     ],
      //   ]).widths(['30%','40%','30%']).end
      // )
      // pdf.add(
      //   new Table([
      //     [
      //       new Cell( new Txt('SUSTRATO').end).fillColor('#dedede').end
      //     ]
      //   ]).widths(['100%']).alignment('center').layout('noBorders').end
      // )
      // pdf.add(
      //   new Table([
      //     [
      //       new Cell( new Txt(`TIPO DE SUSTRATO: ${PRODUCTO.producto.sustrato}`).end).colSpan(2).end,
      //       ''
      //     ],
      //     [
      //       new Cell( new Txt(`TAMAÑO ORIGINAL: ${PRODUCTO.producto.dimensiones}`).end).end,
      //       new Cell( new Txt(`DIRECCIÓN DE FIBRA: ${PRODUCTO.producto.fibra}`).end).end,
      //     ],
      //     [
      //       new Cell( new Txt(`DEMASIA: ${PRODUCTO.demasia}`).end).end,
      //       new Cell( new Txt(`TAMAÑO A IMPRIMIR: ${PRODUCTO.paginas}`).end).end,
      //     ]
      //   ]).widths(['50%','50%']).end
      // )
  
      pdf.create().download(`OP_${PRODUCTO.sort}`)
    }

    generarPDF();
    this.api.getOrdenById(this.id)
      .subscribe((resp:any)=>{
        this.loading = true;
        this.PRODUCTO = resp;
        this.getMaquinas(this.PRODUCTO._id)
        this.cantidad = new Intl.NumberFormat('de-DE').format(this.PRODUCTO.cantidad)
        this.demasia = Math.ceil(this.PRODUCTO.demasia * 100 / this.PRODUCTO.paginas);
        let ejemplares_montados = this.PRODUCTO.producto.ejemplares[this.PRODUCTO.montaje]
        let paginas_sin_demasia = this.PRODUCTO.cantidad /  ejemplares_montados;
        this.hojas_imprimir = Math.ceil(this.PRODUCTO.cantidad / this.PRODUCTO.producto.ejemplares[this.PRODUCTO.montaje])
        this.hojas_demasia = Math.ceil(this.PRODUCTO.demasia * this.hojas_imprimir / 100)
        // this.PRODUCTO.demasia = Math.ceil(this.demasia * paginas_sin_demasia / 100);
        // this.PRODUCTO.demasia = this.PRODUCTO.producto.ejemplares[this.PRODUCTO.montaje]
        // // console.log(this.PRODUCTO, 'este es el Producto');
        this.loading = false;
      })
  }

}
