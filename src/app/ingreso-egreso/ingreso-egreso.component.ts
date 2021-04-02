import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2'
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit {
  formIngresoEgreso: FormGroup
  tipo: string = 'ingreso'
  loadingSubs: Subscription = new Subscription()
  cargando: boolean = false
  constructor(private formbuilder: FormBuilder, public ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) { }

  ngOnInit() {
    this.loadingSubs = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading)
    this.formIngresoEgreso = this.formbuilder.group({
      descripcion: ['', Validators.required],
      monto: [0, Validators.min(0)]
    })
  }


  crearIngresoEgreso() {
    this.store.dispatch(new ActivarLoadingAction())
    const ingresoEgreso = new IngresoEgreso({...this.formIngresoEgreso.value, tipo: this.tipo})

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        Swal.fire('Creado', ingresoEgreso.descripcion, 'success')
        this.store.dispatch(new DesactivarLoadingAction)
      })
      .catch( err => {
        Swal.fire('Error al crear', err.message, 'error')
        this.store.dispatch(new DesactivarLoadingAction)
        console.log(err);
        
      })
    this.formIngresoEgreso.reset()
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe()
  }
}
