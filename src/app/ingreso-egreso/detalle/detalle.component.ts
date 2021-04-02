import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import Swal from 'sweetalert2'
import { IngresoEgresoService } from '../ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit {
  ingresoEgresoItems$: Observable< IngresoEgreso[]> 
  constructor(private store: Store<AppState>, public ingresoEgresoService: IngresoEgresoService) {
   }

  ngOnInit() {
    this.ingresoEgresoItems$ = this.store.select('ingresoEgreso').pipe(map(data => {
      if (data) {
        return data.items
      }
      return []
    }))
  }

  eliminarIngresoEgreso(item: IngresoEgreso) {
    Swal.fire({
      title: `¿Está seguro de eliminar este ${item.tipo} ?`,
      text: item.descripcion,
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33'
    }).then(resp => {
      if (resp.isConfirmed) {
        this.ingresoEgresoService.borrarIngresoEgreso(item.uid)
          .then(resp => {
            Swal.fire('Eliminado correctamente', item.descripcion, 'success')
          })
      }
    })
  }



}
