import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {
  cargando: boolean = false
  subscripcion: Subscription
  constructor(public authService: AuthService, public store: Store<AppState>) { }

  ngOnInit() {
   this.subscripcion  = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading)
  }

  ngSubmit(data: any) {
    this.authService.registrar(data.nombre, data.correo, data.password)
  }

  ngOnDestroy(): void {
    this.subscripcion.unsubscribe()
  }
}
