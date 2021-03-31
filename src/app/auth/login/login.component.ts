import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  cargando: boolean = false
  subscripcion: Subscription
  constructor(public authService: AuthService, public store: Store<AppState>) { }

  ngOnInit() {
    this.subscripcion = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading)
  }

  login(data) {
    this.authService.login(data.correo, data.password)
  }

  ngOnDestroy(): void {
    this.subscripcion.unsubscribe()
  }

}
